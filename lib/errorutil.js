// errorutil.js
// some utility functions for error handling and logging
// © Harald Rudell 2012

var objectutil = require('./objectutil')
var stacktraceparser = require('./stacktraceparser')
// http://nodejs.org/api/path.html
var path = require('path')

;[
getLocation, getLoc, eToString
].forEach(function (f) {exports[f.name] = f})

var doNotPrintTheseProperties = ['arguments', 'stack', 'message']
var onlyPrintErrorPropertyIfHasValue = ['type']

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

		// assemble first line
		// type and message

		// get all properties, enumerable or not
		var properties = []
		Object.getOwnPropertyNames(e).forEach(function (property) {
			if (!~doNotPrintTheseProperties.indexOf(property)) {
				var value = e[property]
				if (value || !~onlyPrintErrorPropertyIfHasValue.indexOf(property)) {
					properties.push(property + ': ' + require('./inspect').inspect(value))
				}
			}
		})

		// put together first line
		var firstLine = [e.constructor && e.constructor.name || 'Error']
		if (e.message || properties.length) firstLine.push(':')
		if (e.message) firstLine.push(' ', e.message)
		if (properties.length) firstLine.push(' {', properties.join(', '), '}')
		result.push(firstLine.join(''))

		// stack trace
		if (trace !== false && e.stack) result.push(e.stack)

		result = result.join('\n')
	// something other than an Error object
	} else result = require('./inspect').inspectDeep(e)

	return result
}

/*
Get the current script executing location
opts: optional object
.offset: offset in the stack for location
.err: optional Error object
.object: optional boolean: false: do not prepend object and method, eg. Module.load
.folder: optional boolean: false: do not include file folder
.fileline: true: no column, no fileheader
.dropExt: remove extention from filename
.addAfterFile: string

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
			if (!opts.fileLine) result.push('file:')
			var s = frame.file
			if (opts.dropExt) s = path.basename(s, path.extname(s))
			if (typeof frame.line == 'number') {
				s += ':' + frame.line
				if (!opts.fileLine) s += ':' + frame.column
			}
			if (opts.addAfterFile) s += ':' + opts.addAfterFile
			result.push(s)
		} else if (opts.addAfterFile) result.push(opts.addAfterFile)
		if (frame.folder && opts.folder !== false) result.push('folder:', frame.folder)
		result = result.join(' ')
	}

	return result
}

/*
get consise location string
s optional string label to be printed

line 45 in folder/file.js: console.log(getLoc()): 'file:45'

if s is string, the string is appended after file:45
line 45 in folder/file.js: console.log(getLoc(arguments.callee.name)): 'file:45:func'
*/
function getLoc(s) {
	var o = {object: false, folder: false, fileLine: true, offset: 1, dropExt: true}
	if (s) o.addAfterFile = s
	return getLocation(o)
}