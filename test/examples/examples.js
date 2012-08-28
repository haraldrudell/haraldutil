// examples.js

/*
new Error is not a good example, because the stack trace is printed
*/

demonstrate(inspectDeep, '../../lib/haraldutil')
demonstrate(inspect, '../../lib/haraldutil')

function inspectDeep(require) {
var haraldutil = require('haraldutil')
console.log(haraldutil.inspectDeep(console))
}

function inspect(require) {
var haraldutil = require('haraldutil')
console.log(haraldutil.inspect(console))
}

// utility

function demonstrate(func, relative) {
	console.log('\n===== ' + func.name + '\n')
	console.log(getSource(func))
	console.log()
	func(myRequire(relative))
}

function getSource(func) {
	var match = func.toString().match(/[\s\S]*\{([\s\S]*)\}/m)
	var source = match ? match[1].trim() : ''
	return source
}

// mock require
function myRequire(relative) {
	return function requireWrapper(module) {
		return require(relative)
	}
}