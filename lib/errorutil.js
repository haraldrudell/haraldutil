// errorutil.js
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

var doNotPrintTheseProperties = [ 'arguments', 'stack', 'message' ]
var ifvalue = [ 'type' ]

// log exception e caught in a catch construct
// heading: optional heading string, eg. 'reading file'
// printmethod: method to use for output, default: console.log
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

function eToString(e) {
	var result = []
	if (e instanceof Error) {
		// error type: message and possible stack trace
		if (e.stack) result.push(e.stack)
		else result.push(e.toString())

		// get all properties, enumerable or not
		Object.getOwnPropertyNames(e).forEach(function (property) {
			if (doNotPrintTheseProperties.indexOf(property) == -1) {
				var value = e[property]
				if (value || ifvalue.indexOf(property) == -1) {
					result.push(property + ':' + inspect.inspect(value))
				}
			}
		})
	} else {
		// something other than an Error object
		result.push(String(e))
	}
	return result.join('\n')
}

/*
get the current script executing location
includeObject: prepend object and method, eg. Module.load
offset: caller offset in the stack
error: use this error object

return value: printable string
'file.js:line:column in:Object.method folder:/usr/local...'
*/
function getLocation(includeObject, offset, error) {
	if (isNaN(offset = Number(offset))) offset = 0
	if (!(error instanceof Error)) error = new Error
	var result = []

	// get text line describing location from a stack trace
	var stackLines = error.stack
	if (typeof stackLines == 'string') {
		stackLines = stackLines.split('\n')
		var line = stackLines[2 + offset] || ''
		/*
		formats are:
		in main:     at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:10:2)
		in function:     at run (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:22:2)
		in emit callback:     at /home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:32:3
		*/

		// remove leading '    at '
		if (line.substring(0, 7) == '    at ') line = line.substring(7)

		// split object.function and absolut:line:column
		var split = line.indexOf(' ')
		var objectFunction = split > 0 ? line.substring(0, split) : ''
		var absolute = line.substring(split + 1)

		// unwrap parenthesis
		if (absolute.charAt(absolute.length - 1) == ')') {
			// absolute is enclosed in parenthesis
			split = absolute.indexOf('(')
			absolute = absolute.substring(split + 1, absolute.length - 1)
		}

		// get file:line:column
		split = absolute.lastIndexOf('/')
		var fileLocation = absolute.substring(split + 1)
		var folder = split > 1 ? absolute.substring(0, split) : ''

		if (fileLocation) result.push('file:' + fileLocation)
		if (includeObject && objectFunction) result.push('function:' + objectFunction)
		if (folder) result.push('folder:' + folder)
	}

	return result.join(' ')
}