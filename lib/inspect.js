// inspect.js
// make anything a unique printable value

/*
in 15.5.4.14 is exemplified how arrays should be printed
- no spaces around '[' and ']'
- separating elements: ', '
- quotes: '"'
*/

var escapechar = require('./escapechar')

module.exports = {
	inspect: inspect,
	inspectAll: inspectAll,
	inspectDeep: inspectDeep,
}

var allObj = {
	maxString: 0,
	maxProperties: 0,
	maxLevels: 0,
	nonEnum: true,
}
var deepObj = {
	maxString: 0,
	maxProperties: 0,
	maxLevels: 0,
}

function inspectAll(v) {
	return inspect(v, allObj)
}

function inspectDeep(v) {
	return inspect(v, deepObj)
}

var suppressedPrototypeFields = ['constructor']
var suppressedFunctionFields = ['name', 'prototype', 'constructor', 'length', 'caller', 'arguments']

/*
return value: printable string
opts: object
.maxString: optional number: max string characters to print, default 40
.maxProperties: optional number: max properties to print, default 10
.maxLevels: optional number: max levels of objects and arrays to print, default 2
.nonEnum: optional boolean, default false: printing of non-enumerable object properties
.noArrayLength: optional boolean, default false: do not print array length
*/
function inspect(v, optsArg) {
	var objects = [] // for detecting cyclic references
	var propertyCount = 0
	var levelCount = 0

	optsArg = Object(optsArg)
	var opts = {}
	ensureNumber(opts, optsArg, 'maxString', 40)
	ensureNumber(opts, optsArg, 'maxProperties', 10)
	ensureNumber(opts, optsArg, 'maxLevels', 2)
	ensureBoolean(opts, optsArg, 'nonEnum', false)

	return getPrintableValue(v)

	function getPrintableValue(v) {
//console.log(arguments.callee.name, v)
		var p = {result:[], v:v}
		
		var t = typeof v
		switch (t) {
		case 'undefined':
			return t

		case 'boolean':
			return String(!!v)

		case 'number':
			if (isNaN(v)) return 'NaN'
			if (!isFinite(v)) return v > 0 ? '+Infinity' : '-Infinity'
			var result = v.toString()
			if (Math.floor(v) == v) return result // integer
			if (result.indexOf('.') == -1) result += '.'
			return result

		case 'string':
			var result = '\''
			for (var index in v) {
				result += escapechar.escapedChar(v.charAt(index))
				if (opts.maxString && result.length - 1 >= opts.maxString) {
					result += '...'
					break
				}
			}
			result += '\''
			return result

		case 'function':
			// function:typical number of arguments

			// print braces only if there are properties
			p.printBracesMaybe = true

			// 'function:2' or 'function name:2'
			p.result.push(t)
			if (v.name) p.result.push(' ', v.name)
			p.result.push(':', v.length)
			break

		case 'object':

			// handle null
			if (v === null) return String(v)
			if (p.printBrackets = Array.isArray(v)) {

				// array dimension
				if (!optsArg.noArrayLength) p.result.push(v.length, ':')
				break
			}

			var innerValue = v.valueOf()
			var tt = typeof innerValue
			if (t != tt) {
				// it's a primitive object

				p.printBracesMaybe = true

				// strings also appears as an array of characters not to be printed
				p.printPropertiesMaybe = tt == 'string'

				// 'Object(5)' or 'Date(5)'
				p.result.push(v instanceof Date ? 'Date' : 'Object',
					'(', getPrintableValue(innerValue), ')')

				break
			}

			// it's a regular object, maybe with a constructor name
			if (v.constructor.name && v.constructor.name != 'Object') {
				p.result.push('object:', v.constructor.name)
			}
			break

		default:
			// should not arrive here: unknown type or code problem
			throw Error('unknown type:' + t)
		} // switch

		return printProperties(p).join('')
	} // getPrintableValue

	/*
	print possible properties

	p object controls printing of properties
	.result: string: result so far
	.printBracesMaybe: boolean: output enclosing braces if there are properties to print
	.printPropertiesMaybe: boolean: print properties other than array keys
	.printBrackets: boolean: print brackets rather than braces
	*/
	function printProperties(p) {
		var propObj
		var protoArray = []
		var printed = 0
		var didPrint
		objects.push(p.v)

		// opening brace or bracket
		var firstLeadIn
		var leadIn = ', '
		var endOut = ']'
		var indent
		if (p.printBrackets) p.result.push('[')
		else {
			var endOut = '}'
			indent = [ '\n' ]
			for (var i = 0; i < levelCount; i++) indent.push('  ')
			indent = indent.join('')
			var propIndent = indent + '  '
			leadIn = ',' + propIndent
			if (!p.printBracesMaybe) {
				if (p.result.length) p.result.push(' ')
				p.result.push('{')
				firstLeadIn = propIndent
			} else firstLeadIn = ' {' + propIndent
		}

		if (opts.maxLevels == 0 || levelCount < opts.maxLevels) for (;;) {

			// get the next list of properties
			var propertyList
			// simple list: all properties of the object at once
			if (!opts.nonEnum) propertyList = Object.keys(propObj = p.v)
			else {
				// properties by prototype
				if (!propObj) propObj = p.v
				else {
					// find the next prototype
					var propObj = propObj.__proto__
					if (!propObj || // prototype chain ended
						propObj == Object.prototype || // prototype Object
						propObj == Function.prototype ||
						propObj == Array.prototype ||
						propObj == Error.prototype) break
					protoArray.push(propObj.constructor && propObj.constructor.name || '')
				}
				propertyList = getProperties(propObj, protoArray.length != 0)

			}

			// iterate over all properties
//if (!Array.isArray(propertyList)) {
//console.log('propertyList:', typeof propertyList, propertyList)
//}
			propertyList.every(printProperty)
			if (!opts.nonEnum) break
		} else { // at max depth
//console.log('maxx')
			p.result.push('...')
		}

		// closing bracket or brace
		if (p.printBrackets) p.result.push(endOut)
		else if (!p.printBracesMaybe || didPrint) {
			if (printed) p.result.push(indent)
			p.result.push(endOut)
		}

		return p.result

		function printProperty(propertyName, index) {

			// printing of an object primtive string
			// avoid printing the string also as an arrray
			if (p.printPropertiesMaybe && printed == propertyName) {
				printed++
				return true
			}

			// we will print this property
			propertyCount++
			printed++
			didPrint = true

			// check for limited number of properties to print
			if (opts.maxProperties != 0 && propertyCount > opts.maxProperties) {
				if (propertyCount - 1 == opts.maxProperties) p.result.push(leadIn, '...')
				return false
			}

			// lead-in for property name
			if (printed == 1) {
				if (firstLeadIn) p.result.push(firstLeadIn)
			} else p.result.push(leadIn)

			// prototype labels		
			if (protoArray.length) {
				protoArray.forEach(function (prototypeName) {
					if (prototypeName) p.result.push('-- prototype:', prototypeName)
					else p.result.push('-- prototype')
					p.result.push(leadIn)
				})
				protoArray = []
			}

			// property name
			// suppressed for array's linear index 0..
			var getter
			if (!p.printBrackets || (printed - 1) != propertyName) {

				if (opts.nonEnum) {
//console.log('getdesc:', propObj, propertyName)
					// check for detailed property data
					var propertyDescriptor = Object.getOwnPropertyDescriptor(propObj, propertyName)
					if (propertyDescriptor.enumerable === false) p.result.push('(nonE)')
					if (propertyDescriptor.get) {
						getter = propertyDescriptor.get
						p.result.push('(get)')
					}
				}
				p.result.push(propertyName, ':')
			}

			// value
			var value = !getter? propObj[propertyName] : getter()
			var recursive = objects.indexOf(value) + 1
			if (!recursive) {
				levelCount++
//console.log('recursing:', value)
				p.result.push(getPrintableValue(value))
//console.log('got:', p.result[p.result.length - 1])
				levelCount--
			} else p.result.push('recursive-object#', recursive)

			return true
		}

		function getProperties(object, doSuppress) {
			var props = []
			var nonEnumProps = []
			var suppress
			if (typeof object == 'function') suppress = suppressedFunctionFields
			else if (doSuppress) suppress = suppressedPrototypeFields

			Object.getOwnPropertyNames(object).forEach(function (prop) {

				// suppress
				if (!suppress || suppress.indexOf(prop) == -1) {
					if (v.propertyIsEnumerable(prop)) props.push(prop)
					else nonEnumProps.push(prop)
				}
			})

			// append nonEnumProps
			props.push.apply(props, nonEnumProps)

//console.log(arguments.callee.name, props, nonEnumProps)
			return props
		}
	}

}

// if not a number 0 or greater, set to default
function ensureNumber(outObj, inObj, property, aDefault) {
	var v = inObj[property]
	outObj[property] =
		(v == null || typeof v.valueOf() != 'number' || v < 0) ?
			aDefault :
			v
}

function ensureBoolean(outObj, inObj, property, aDefault) {
	var v = inObj[property]
	outObj[property] = v === undefined ? aDefault : !!v
}