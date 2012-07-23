// util.js
// some utility functions for error handling and logging
// written by Harald Rudell

module.exports = merge({
		logException: logException,
		checkSuccess: checkSuccess,
		logError: logError,
		getLocation: getLocation,
		toNumber: toNumber,
	},
	require('./timeutil'),
	require('./inspect')
)

// log exception e caught in a catch construct
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location
function logException(e, heading, printmethod, offset) {
	logError(e, heading || 'Caught exception', undefined, (offset || 0) + 1)
}

// check success in a callback
// error: callback error argument
// heading: optional heading string, eg. 'reading file'
// printmethod: method to use for output, default: console.log
// offset possible call stack offset, default callers location
// return value: true if there was no error
function checkSuccess(error, heading, printmethod, offset) {
	var success = error == null
	if (!success) {
		logError(error, heading, printmethod, (offset || 0) + 1)
	}
	return success
}

// log an error
// e: error value, such as an Error object or catch argument
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location
function logError(e, heading, printmethod, offset) {
	// parse arguments
	if (!heading) heading = 'Issue discovered'
	if (!printmethod) printmethod = console.log

	// add location
	heading += ' at ' + getLocation(true, (offset || 0) + 1)

	// non-Error values
	if (! e instanceof Error) printmethod(heading, e)
	else {

		// Error values
		var p = []
		p.push(heading)
		if (e.stack) p.push(e.stack)
		else p.push(e.toString())		
		if (e.errno) p.push('errno:' + e.errno)
		if (e.code) p.push('code:' + e.code)
		if (e.path) p.push('path:' + e.path)
		printmethod(p.join('\n'))
	}
}

// get the current script executing location
// includeObject: prepend object and method, eg. Module.load
// offset: caller offset in the stack
// return value: printable string eg. 'tracker.js:5:15-Object.<anonymous>'
function getLocation(includeObject, offset) {
	var result = ''

	// make sure offset is some sort of numeric
	if (offset == null) offset = 0

	// get text line describing location from a stack trace
	var line = ''
	var e = new Error()
	if (typeof e.stack == 'string') {
		var frames = e.stack.split('\n')
		line = frames[2 + offset] || ''
		// formats are:
		// in main:     at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:10:2)
		// in function:     at run (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:22:2)
		// in emit callback:     at /home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:32:3

		// get filename:line:column
		var fileLocation = ''
		var fileColumn = line.lastIndexOf('/')
		if (fileColumn != -1) {
			var lastcolonColumn = line.lastIndexOf(')')
			if (lastcolonColumn == -1) lastcolonColumn = line.length + 1
			fileLocation = line.substring(fileColumn + 1, lastcolonColumn)
			result = 'file:' + fileLocation
		}

		// get Object.Function
		var objectAndFunction = ''
		if (includeObject) {
			var atColumn = line.indexOf('at ')
			if (atColumn != -1) {
				var endColumn = line.lastIndexOf(' (')
				if (endColumn != -1) {
					objectAndFunction = line.substring(atColumn + 3, endColumn)
					result += ' function:' + objectAndFunction
				}
			}
		}
	}

	return result
}

// parse numbers, NaN if trailing non-numeric characters
// str: string: format: [+-]0-9..[.0-9..]
// allowFloat: optional boolean: allow decimal part, default no
// leading and trailing whitespace and line terminators are allowed
// bad numbers return NaN
function toNumber(str, allowFloat) {
	var result = NaN

	if (str != null) if (typeof str.valueOf() == 'string') {

		// skip leading and trailing whiteSpace and lineTerminator
		var digits = str.trim()

		if (isNumberSyntaxOk(digits, allowFloat)) result = allowFloat ? parseFloat(digits) : parseInt(digits)
	} else if (typeof str.valueOf() == 'number') result = Number(str)

	return result
}

// check syntax: only digits allowed, one possible decimal point
// str: string
// return value: true if number syntax is ok
function isNumberSyntaxOk(str, allowFloat) {
	var result = str.length > 0 // empty string not ok
	var sawDecimalPoint = false

	for (var index in str) {
		var value = "0123456789.-+".indexOf(str.charAt(index))

		// digit: ok
		if (value >= 0 && value < 10) continue

		// one decimal point: ok if float
		if (value == 10 && allowFloat && !sawDecimalPoint) {
			sawDecimalPoint = true
			continue
		}

		// leading plus or minus: ok
		if ((value == 11 || value == 12) && index == 0) continue

		// bad character
		result = false
		break
	}

	return result
}

// return an object with the properties of all provided objects
function merge() {
	var result = {}
	Array.prototype.slice.call(arguments, 0).forEach(function (argument) {
		for (property in argument) result[property] = argument[property]
	})
	return result
}