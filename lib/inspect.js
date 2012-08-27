// inspect.js
// make anything a unique printable value
// © Harald Rudell 2012

ip = require('./inspectproperties')

var escapechar = require('./escapechar')
Array(

inspect, inspectAll, inspectDeep
).forEach(function (f) {exports[f.name] = f})

/*
in 15.5.4.14 is exemplified how arrays should be printed
- no spaces around '[' and ']'
- separating elements: ', ' comma and space
- double quotes used for strings: '"'
*/

var allObj = {
	maxString: 0,
	maxProperties: 0,
	maxLevels: 0,
	nonEnum: true,
}
var deepObj = {
	maxString: 0,
	maxProperties: 10,
	maxLevels: 0,
	nonEnum: true,
}

function inspectAll(v) {
	return inspect(v, allObj)
}

function inspectDeep(v) {
	return inspect(v, deepObj)
}

var functionMatcher = /^function ([^\(]*)(\([^\)]*\)) {/
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
	// g holds global properties for this invocation
	var g = {
		objects: [], // for detecting cyclic references
		levelCount: 0, // limiting property levels printed
		opts: getOpts(optsArg),
	}
	return getPrintableValue(v)

	function getPrintableValue(v) {
		// p wraps the result and progress data
		var p = {
			result:[],
			v:v, // the original value
			g:g, // global properties
			getPrintableValue: getPrintableValue,
		}
		
		// t is type name as a string
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
				if (g.opts.maxString && result.length - 1 >= g.opts.maxString) {
					result += '...'
					break
				}
			}
			result += '\''
			return result

		case 'function':
			// print braces only if there are properties for this function object
			p.printBracesMaybe = true

			/*
			'function f(a, b)' if we can parse
			'function (a, b)' if we can parse
			'function f:2' or
			'function:2'
			*/
			p.result.push(t)
			if (v.name) p.result.push(' ', v.name)
			// match[1]: function name, match[2]: argument list '(a,b)'
			var match = functionMatcher.exec(v.toString())
			if (match && match[1] == v.name) {
				if (!v.name) p.result.push(' ')
				p.result.push(match[2])
			} else p.result.push(':', v.length)
			
			break

		case 'object':

			// handle null
			if (v === null) return String(v)

			// handle arrays
			if (p.printBrackets = Array.isArray(v)) {
				// array dimension
				if (!g.opts.noArrayLength) p.result.push(v.length, ':')
				break
			}

			// handle primtive objects and Date
			var innerValue = v.valueOf()
			var tt = typeof innerValue
			if (t != tt) {
				// it's a primitive object
				p.printBracesMaybe = true

				// strings also appears as an array of characters: do not print
				p.printPropertiesMaybe = tt == 'string'

				// 'Object(5)' or 'Date(5)'
				p.result.push(v instanceof Date ? 'Date' : 'Object',
					'(', getPrintableValue(innerValue), ')')

				break
			}

			// handle RegExp
			if (v instanceof RegExp) {
				p.printBracesMaybe = true
				p.result.push(v.toString())
				break
			}

			/*
			regular object
			object:Constructor
			*/
			if (v.constructor.name && v.constructor.name != 'Object') {
				p.result.push('object:', v.constructor.name)
			}
			break

		default:
			// should not arrive here: unknown type or code problem
			throw Error('unknown type:' + t)
		} // switch

		return ip.printProperties(p).join('')
	}
}

function getOpts(optsArg) {
	optsArg = Object(optsArg)
	var opts = {}
	ensureNumber(opts, optsArg, 'maxString', 80)
	ensureNumber(opts, optsArg, 'maxProperties', 10)
	ensureNumber(opts, optsArg, 'maxLevels', 2)
	ensureBoolean(opts, optsArg, 'nonEnum', false)
	ensureBoolean(opts, optsArg, 'noArrayLength', false)
	return opts
}

// if not a number 0 or greater, set to default. Convert to number
function ensureNumber(outObj, inObj, property, aDefault) {
	var v = inObj[property]
	outObj[property] =
		(v == null || typeof v.valueOf() != 'number' || v < 0) ?
			aDefault :
			v.valueOf()
}

// if undefined, use default. Convert to boolean
function ensureBoolean(outObj, inObj, property, aDefault) {
	var v = inObj[property]
	outObj[property] = v === undefined ? aDefault : !!v
}