// inspect.js
// make anything a unique printable value

module.exports = {
	inspect: inspect,
	inspectAll: inspectAll,
	inspectDeep: inspectDeep,
}

// for a string, only these characters are printed
// - others become '*'
var allowedChars =
	' !"#$%&\'()*,-./0123456789:;<=>?' +
	'@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_' +
	'`abcdefghijklmnopqrstuvwxyz{|}~'
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

// return value: printable string
// opts: object
// .maxString: optional number, default 40, max character of string to print
// .maxProperties: optional number,default 10: max properties ot print
// .maxLevels: optional numvber, default 2: max levels of objects and arrays to print
// .nonEnum: optional boolean, default false: printing of non-enumerable object properties
function inspect(v, optsArg) {
	var objects = [] // for detecting cyclic references
	var propertyCount = 0
	var levelCount = 0

	if (optsArg == null || typeof optsArg != 'object') optsArg = {}
	opts = {}
	ensureNumber(opts, optsArg, 'maxString', 40)
	ensureNumber(opts, optsArg, 'maxProperties', 10)
	ensureNumber(opts, optsArg, 'maxLevels', 2)
	ensureBoolean(opts, optsArg, 'nonEnum', false)

	return getPrintableValue(v)

	function getPrintableValue(v) {
		var result
		var printBrackets
		var printBracesMaybe
		var printPropertiesMaybe
		
		var t = typeof v
		switch (t) {
		case 'undefined':
			return t

		case 'boolean':
			return (!!v).toString()

		case 'number':
			if (isNaN(v)) return 'NaN'
			if (!isFinite(v)) return v > 0 ? '+Infinity' : '-Infinity'
			result = v.toString()
			if (Math.floor(v) == v) return result // integer
			if (result.indexOf('.') == -1) result += '.'
			return result

		case 'string':
			result = '\''
			for (var index in v) {
				var ch = v.charAt(index)
				if (allowedChars.indexOf(ch) == -1) ch = '*'
				result += ch
				if (opts.maxString && result.length - 1 >= opts.maxString) {
					result += '...'
					break
				}
			}
			result += '\''
			return result

		case 'function':
			// function:typical number of arguments
			printBracesMaybe = true
			result = t
			if (v.name) result += ' ' + v.name
			result += ':' + v.length
			// add name if there is one
			break

		case 'object':
			// handle null
			if (v === null) return String(v)

			if (printBrackets = Array.isArray(v)) {
				// array
				result = optsArg.noArrayLength ? '' : v.length + ':'
				break
			}

			var innerValue = v.valueOf()
			var tt = typeof innerValue
			if (t != tt) {
				// primitive object
				printBracesMaybe = true
				printPropertiesMaybe = tt == 'string'
				result = v instanceof Date ? 'Date' : 'Object'
				result += '(' + getPrintableValue(innerValue) + ')'
				break
			}

			result = ''
			if (v.constructor.name &&
				v.constructor.name != 'Object') {
				result += 'object:' + v.constructor.name
			}
			break
		default:
			// should not arrive here: unknown type or code problem
			throw Error('unknown type:' + t)
		} // switch

		// we have something that may have properties: print them
		do {
			var printed = 0
			var didPrint = false
			objects.push(v)
			if (printBrackets) result += '[ '
			else if (!printBracesMaybe) {
				if (result.length) result += ' '
				result += '{'
			}

			var propertyList = Object.keys(v)
			var enumIndex = propertyList.length
			if (opts.nonEnum) {
				Object.getOwnPropertyNames(v).forEach(function (prop) {
					if (!v.propertyIsEnumerable(prop)) {
						propertyList.push(prop)
					}
				})
			}
			//console.log('lengths', enumIndex, propertyList.length)

			// enumerable properties
			propertyList.every(function (propertyName, index) {
				if (opts.limitedProperties && opts.maxProperties == 0) {
					result += '...'
					return false
				}
				if (printPropertiesMaybe && printed == propertyName) {
					printed++
					return true
				} else didPrint = true

				propertyCount++
				if (opts.maxProperties != 0 && propertyCount > opts.maxProperties) {
					if (propertyCount - 1 == opts.maxProperties) result += '...'
					return false
				}

				var propertyDescriptor = index < enumIndex ? {} :
				Object.getOwnPropertyDescriptor(v, propertyName)

				if (printed == 0) {
					if (!printBrackets) result += printBracesMaybe ? ' {\n' : '\n'
				} else if(printed > 0) {
					result += ', '
					if (!printBrackets) result += '\n'
				}
				// property name
				if (!printBrackets || printed != propertyName) {
					for (var i = 0; i <= levelCount; i++) result += '  '
					if (propertyDescriptor.enumerable === false) result += '(nonE)'
					if (propertyDescriptor.get) result += '(get)'
					result += propertyName + ': '
				}
				printed++

				// value
				var value
				if (index < enumIndex) {
					value = v[propertyName]
				}  else {
					value = propertyDescriptor.get ?
						propertyDescriptor.get() :
						propertyDescriptor.value
				}
				var recursive = objects.indexOf(value) != -1
				if (recursive) {
					result += 'recursive-object#' + recursive
				} else {
					levelCount++
					if (opts.maxLevels == 0 || levelCount < opts.maxLevels) {
						result += getPrintableValue(value)
					}
					levelCount--
				}
				return true
			}) // for property

		} while (false)

		// closing bracket or brace
		if (printBrackets) result += ' ]'
		else if (!printBracesMaybe || didPrint) {
			result += didPrint ? '\n}' : '}'
		}

		return result
	} // getPrintableValue

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
}