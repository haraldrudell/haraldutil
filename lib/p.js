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
exports.p_prepend = p_prepend
exports.pp = pp
exports.pps = pps
exports.pargs = pargs

/*
print executing location and inspect of arguments
file:line:function 'abc'
return value: the printed string
*/
function p() {
	var s = pCommon(Array.prototype.slice.call(arguments))
	try {
		console.log(s)
	} catch (e) {}

	return s
}

/*
Get string value of a function's argument list
argumentsValue: arguments object
return value: printable string

use like: p(pargs(arguments))
*/
function pargs(argumentsValue) {
	return util.format.apply(this,
		[0].concat(Array.prototype.slice.call(argumentsValue))
		).substring(2)
}

/*
Facilitate prepend such as process id or host name
str: string prepend value, strict null does not modify prepend
return value: the prepend string
*/
var prepend
function p_prepend(str) {
	if (str !== null) prepend = str
	return prepend
}

// return value: string executing location file:line:function and inspect of arguments
function ps() {
	return pCommon(Array.prototype.slice.call(arguments))
}

/*
exeuting location and inspect deep of arguments
return value: the printed string
*/
function pp() {
	var result = ppCommon(Array.prototype.slice.call(arguments))
	try {
		console.log(result)
	} catch (e) {}

	return result
}

function pps() {
	return ppCommon(Array.prototype.slice.call(arguments))
}

// utility functions

// argArray: array of arguments to be printed
function pCommon(argArray) {

	// add location and prepend to argArray
	var result = getLocation(3)
	if (prepend)
		if (result) result = prepend + ':' + result
		else result = prepend
	if (result) argArray.unshift(result)

	// util.format only works if first argument is not string
	// add a number in front, then remove it from the result
	return util.format.apply(this, [0].concat(argArray)).substring(2)
}

function ppCommon(argArray) {

	// add location and prepend to argArray
	var result = getLocation(3)
	if (prepend)
		if (result) result = prepend + ':' + result
		else result = prepend

	// get the value string
	var s = []
	Array.prototype.slice.call(arguments).forEach(function (value, index) {
		s.push(index + ': ' + inspect.inspectDeep(value))
	})

	if (s.length)
		if (result) result += ' ' + s.join(', ')
		else result = s.join(', ')

	return result || ''
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