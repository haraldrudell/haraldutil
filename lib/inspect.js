// inspect.js
// Make anything printable
// © Harald Rudell 2012

// TODO dates as ISO string values

var inspectproperties = require('./inspectproperties')

var escapechar = require('./escapechar')
var errorutil = require('./errorutil')

;[inspect, inspectAll, inspectDeep]
.forEach(function (f) {exports[f.name] = f})

/*
in 15.5.4.14 is exemplified how arrays should be printed
- no spaces around '[' and ']'
- separating elements: ', ' comma and space
- double quotes used for strings: '"'
*/

var allObj = {
	maxString: 0,
	maxProperties: 0,
	maxLevels: null,
	nonEnum: true,
}
function inspectAll(v) {
	return inspect(v, allObj)
}

// unlimited strings, 10 array properties, unlimited levels, non-enumerable properties
var deepObj = {
	maxString: 0,
	maxProperties: 10,
	maxLevels: null,
	nonEnum: true,
}
function inspectDeep(v) {
	return inspect(v, deepObj)
}

var functionMatcher = /^function ([^\(]*)(\([^\)]*\)) {/
/*
Get a unique string representation of the value v
opts: object
.maxString: optional number: max string characters to print, default 40
.maxProperties: optional number: max array-type properties to print, default 10
.maxLevels: optional number: max levels of objects and arrays to print 0.., default 2, null means all
.nonEnum: optional boolean, default false: print non-enumerable object properties
.noArrayLength: optional boolean, default false: do not print array length
.singleLine optional boolean default false: print on a single line
.dateISO optional boolean default false: print dates as ISO strings
.errorPretty optional boolean default false: print errors using eToString
return value: printable string

non-ascii characters are escpaced using JavaScript character escapes
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
				if (!g.opts.noArrayLength) p.result.push(v.length)
				break
			}

			// handle primtive objects and Date

			// there are objects where valueOf() throws exception
			// eg. process.env
			// TypeError: Property 'valueOf' of object #<error> is not a function
			var tt
			var innerValue
			try {
				innerValue = v.valueOf()
				tt = typeof innerValue
			} catch (e) {
				// exception: assume this is not a primitive object
				innerValue = v
				tt = t
			}

			if (t != tt) {
				// it's a primitive object
				p.printBracesMaybe = true

				// strings also appears as an array of characters: do not print
				p.printPropertiesMaybe = tt == 'string'

				if (g.opts.dateISO && v instanceof Date) {
					return v.toISOString()
				}

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

			// pretty print Errors
			if (g.opts.errorPretty && v instanceof Error) {
				return errorutil.eToString(v, false) || 'Error'
			}

			/*
			regular object
			object:Constructor
			*/
			if (v.constructor && v.constructor.name && v.constructor.name != 'Object') {
				p.result.push('object:', v.constructor.name)
			}
			break

		default:
			// should not arrive here: unknown type or code problem
			throw Error('unknown type:' + t)
		} // switch

		return inspectproperties.printProperties(p).join('')
	}
}

function getOpts(optsArg) {
	optsArg = Object(optsArg)
	var opts = {}
	ensureNumber(opts, optsArg, 'maxString', 80)
	ensureNumber(opts, optsArg, 'maxProperties', 10)
	ensureNumber(opts, optsArg, 'maxLevels', 2, true)
	ensureBoolean(opts, optsArg, 'nonEnum', false)
	ensureBoolean(opts, optsArg, 'noArrayLength', false)
	ensureBoolean(opts, optsArg, 'singleLine', false)
	ensureBoolean(opts, optsArg, 'dateISO', false)
	ensureBoolean(opts, optsArg, 'errorPretty', false)
	return opts
}

// if not a number 0 or greater, set to default. Convert to number
function ensureNumber(outObj, inObj, property, aDefault, canHaveNull) {
	var v = inObj[property]
	outObj[property] =
		v == null && !canHaveNull || // missing option and an option where this is not allowed
		v != null && (
			typeof v.valueOf() != 'number' || // not numeric
			v < 0) ? // negative
			aDefault :
			v == null ? null : v.valueOf() // either null or number type
}

// if undefined, use default. Convert to boolean
function ensureBoolean(outObj, inObj, property, aDefault) {
	var v = inObj[property]
	outObj[property] = v === undefined ? aDefault : !!v
}