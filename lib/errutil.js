// errutil.js
// some utility functions for error handling and logging
// written by Harald Rudell

var inspect = require('./inspect')

module.exports = {
	logException: logException,
	checkSuccess: checkSuccess,
	logError: logError,
	getLocation: getLocation,
	eToString: eToString,
}

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
	var result = heading || 'Issue discovered'
	if (!printmethod) printmethod = console.log

	// add location
	result += ' at ' + getLocation(true, (offset || 0) + 1)
	result += eToString(e)

	// print
	printmethod(result)
}

var ignore = [ 'arguments', 'stack', 'message' ]
var ifvalue = [ 'type' ]
function eToString(e) {
	var result = []
	if (e instanceof Error) {
		// error type: message and possible stack trace
		if (e.stack) result.push(e.stack)
		else result.push(e.toString())

		// get all properties, enumerable or not
		Object.getOwnPropertyNames(e).forEach(function (property) {
			if (ignore.indexOf(property) == -1) {
				var value = e[property]
				if (value || ifvalue.indexOf(property) == -1) {
					result.push(property + ': ' + inspect.inspect(value))
				}
			}
		})
	} else {
		// something other than an Error object
		result.push(String(e))
	}
	return result.join('\n')
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