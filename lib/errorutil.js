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
noTrace: optional boolean: false: do not include the stack trace

return value: printable string
*/
function eToString(e, noTrace) {
	var result

	if (e instanceof Error) {
		result = []
		// error type: message and possible stack trace
		if (noTrace !== false && e.stack) result.push(e.stack)
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
.offset: offset in the stack for lcoation
.err: optional Error object
.object: optional boolean: false: do not prepend object and method, eg. Module.load
.folder: optional boolean: false: do not include file folder

return value: printable string
'Object.method file: file.js:line:column folder: /usr/local...'
empty string on troubles
*/
function getLocation(opts) {
	opts = objectutil.shallowClone(opts)
	if (isNaN(opts.offset = Number(opts.offset))) opts.offset = 1
	if (!(opts.err instanceof Error)) opts.err = new Error

	var result = ''

	var stack = stacktraceparser.parseTrace(opts.err)
	var frame
	if (stack &&
		Array.isArray(stack.frames) &&
		(frame = stack.frames[opts.offset])) {
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