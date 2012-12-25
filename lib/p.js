// p.js
// handle logging with concise script location
// © Harald Rudell 2012

var stacktraceparser = require('./stacktraceparser')
// http://nodejs.org/api/util.html
var util = require('util')
// http://nodejs.org/api/path.html
var path = require('path')

exports.p = p
exports.ps = ps

// file:line:func
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
				if (func) s.push(':', func)
			}
			if (s.length) result = s.join('')
		}
	}

	return result
}
function ps() {
	var location = getLocation(2)
	var args = Array.prototype.slice.call(arguments)
	if (location) args.unshift(location)
	return util.format.apply(this, args)
}

function p() {
	var location = getLocation(2)
	var args = Array.prototype.slice.call(arguments)
	if (location) args.unshift(location)
	var s = util.format.apply(this, args)
	console.log(s)
	return s
}