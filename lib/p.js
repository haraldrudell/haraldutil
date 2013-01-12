// p.js
// handle logging with concise script location
// © Harald Rudell 2012

/*
util.format does a good job on inspect, but the first argument can't be string, or it will go into printf mode.
*/

var stacktraceparser = require('./stacktraceparser')
var inspect = require('./inspect')
// http://nodejs.org/api/util.html
var util = require('util')
// http://nodejs.org/api/path.html
var path = require('path')

exports.p = p
exports.ps = ps
exports.q = q
exports.qs = qs
exports.pPrepend = pPrepend
exports.pargs = pargs
exports.pp = pp
exports.pps = pps

var defOpts = {singleLine: true, dateISO: true, errorPretty: true}
var deepOpts = {singleLine: false, dateISO: false, errorPretty: false, maxString: 0, maxProperties: 10, maxLevels: null, nonEnum: true}

/*
print executing location and plain argument values
file:line:function 'abc'
return value: the printed string
*/
function p() {
	return utilFormat(arguments, true)
}

/*
Get string value of a function's argument list
argumentsValue: arguments object
return value: printable string

use like: p(pargs(arguments))
*/
function pargs(argumentsValue) {
	var s = pCommon(argumentsValue, undefined, true)
	try {
		console.log(s)
	} catch (e) {}

	return s
}

/*
Facilitate prepend such as process id or host name
str: string prepend value, strict null does not modify prepend
return value: the prepend string
*/
var prepend
function pPrepend(str) {
	if (str !== null) prepend = str
	return prepend
}

// return value: string executing location file:line:function and inspect of arguments
function ps() {
	return utilFormat(arguments)
}

function q() {
	var result = pCommon(arguments)
	try {
		console.log(result)
	} catch (e) {}

	return result
}

function qs() {
	return pCommon(arguments)
}

/*
exeuting location and inspect deep of arguments
return value: the printed string
*/
function pp() {
	var result = pCommon(arguments, deepOpts)
	try {
		console.log(result)
	} catch (e) {}

	return result
}

function pps() {
	return pCommon(arguments, deepOpts)
}

// utility functions

function utilFormat(argumentsValue, doLog) {
	var result = []

	// location and prepend
	var leadin = []
	var location = getLocation(3)
	if (prepend) {
		leadin.push(prepend)
		if (location) leadin.push(':')
	}
	if (location) leadin.push(location)
	if (leadin.length) result.push(leadin.join(''))

	// util.format
	var str = util.format.apply(this, Array.prototype.slice.call(argumentsValue))
	if (str) result.push(str)
	result = result.join(' ')

	if (doLog)
		try {
			console.log(result)
		} catch (e) {}

	return result
}

// argArray: array of arguments to be printed
function pCommon(argumentsValue, options, doComma) {
	var result = []

	// prepend and location
	var leadin = []
	var location = getLocation(3)
	if (prepend) {
		leadin.push(prepend)
		if (location) leadin.push(':')
	}
	if (location) leadin.push(location)
	if (leadin.length) result.push(leadin.join(''))

	// values
	var values = []
	Array.prototype.slice.call(argumentsValue).forEach(function (value) {
		values.push(inspect.inspect(value, options || defOpts))
	})
	if (values.length) result.push(values.join(doComma ? ', ' : ' '))

	return result.join(' ')
}

/*
Get executing location
index: optional number, caller level for the printout, default the direct caller

if function name is anonymous it is removed from the result

return value: string file:line:function, eg. 'examples:19:LogPrinter'
- undefined on troubles
*/
function getLocation(index) {
	var result

	var parsedTrace = stacktraceparser.parseTrace(new Error())
	if (parsedTrace && Array.isArray(parsedTrace.frames)) {
		var frame = parsedTrace.frames[index]
		if (frame) {
			var s = []
			var file = frame.file
			if (file) file = path.basename(file, path.extname(file))
			if (file) s.push(file)
			if (typeof frame.line === 'number') s.push(':', frame.line)
			if (typeof frame.func === 'string') {
				var func = frame.func.substring(frame.func.lastIndexOf('.') + 1)
				if (func && func != '<anonymous>') s.push(':', func)
			}
			if (s.length) result = s.join('')
		}
	}

	return result
}