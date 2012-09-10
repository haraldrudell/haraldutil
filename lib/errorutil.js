// errorutil.js
// some utility functions for error handling and logging
// © Harald Rudell 2012

var inspect = require('./inspect')
var objectutil = require('./objectutil')
var stacktraceparser = require('./stacktraceparser')

module.exports = {
	getLocation: getLocation,
	eToString: eToString,
}

var doNotPrintTheseProperties = [ 'arguments', 'stack', 'message' ]
var onlyPrintErrorPropertyIfHasValue = [ 'type' ]

/*
make an Error object printable
e: Error object
trace: optional boolean: false: do not include the stack trace

return value: printable string
*/
function eToString(e, trace) {
	var result

	if (e instanceof Error) {
		result = []
		// error type: message and possible stack trace
		if (trace !== false && e.stack) result.push(e.stack)
		else result.push(e.toString())

		// get all properties, enumerable or not
		Object.getOwnPropertyNames(e).forEach(function (property) {
			if (!~doNotPrintTheseProperties.indexOf(property)) {
				var value = e[property]
				if (value || !~onlyPrintErrorPropertyIfHasValue.indexOf(property)) {
					result.push(property + ': ' + inspect.inspect(value))
				}
			}
		})
		result = result.join('\n')
	// something other than an Error object
	} else result = inspect.inspectDeep(e)

	return result
}

/*
Get the current script executing location
opts: optional object
.offset: offset in the stack for location
.err: optional Error object
.object: optional boolean: false: do not prepend object and method, eg. Module.load
.folder: optional boolean: false: do not include file folder

return value: printable string
'Object.method file: file.js:line:column folder: /usr/local...'
empty string on troubles
*/
function getLocation(opts) {
	opts = objectutil.shallowClone(opts)
	if (isNaN(opts.offset = Number(opts.offset))) opts.offset = 0
	if (!(opts.err instanceof Error)) {
		opts.err = new Error
		opts.offset++
	}

	var result = ''

	var stack = stacktraceparser.parseTrace(opts.err)
	if (stack && Array.isArray(stack.frames)) {

		// if you do e = Error(5) you get a funny stack trace start
		// as opposed to e = new Error(5)
		var frame = stack.frames[0]
		if (frame && frame.text == 'Error (unknown source)') opts.offset++

		frame = stack.frames[opts.offset]
		result = []
		if (frame.func && opts.object !== false) result.push('function:', frame.func)
		if (frame.file) {
			result.push('file:')
			var s = frame.file
			if (typeof frame.line == 'number') s += ':' + frame.line + ':' + frame.column
			result.push(s)
		}
		if (frame.folder && opts.folder !== false) result.push('folder:', frame.folder)
		result = result.join(' ')
	}

	return result
}