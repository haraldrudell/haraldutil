// examples.js
// haraldutil examples for readme
// © Harald Rudell 2012

var realPath = '../../lib/haraldutil'

// code

var demos = [

function inspectDeep(require) {
var haraldutil = require('haraldutil')
console.log(haraldutil.inspectDeep(console))
},

function inspect(require) {
var haraldutil = require('haraldutil')
var a = 'abcdefghijklm'.split('')
console.log(haraldutil.inspect(a))
},
/*
function browseTo(require) {
require('haraldutil').browseTo('http://google.com').on('exit', function (code) {
	if (code) console.log('Failed with exit code:' + code)
})
},
*/
function merge(require) {
var haraldutil = require('haraldutil')
console.log(haraldutil.merge({a: 1}, {a: 2, b: 2}, {c: 3}))
},

function getType(require) {
var haraldutil = require('haraldutil')
console.log('Type:', haraldutil.getType('/home'))
},

function parseTrace(require) {
var haraldutil = require('haraldutil')
var s = haraldutil.parseTrace(new Error)
if (s) console.log(s.frames[0])
},

function getLocation(require) {
var haraldutil = require('haraldutil')
console.log(haraldutil.getLocation())
},

function eToString(require) {
var haraldutil = require('haraldutil')
try {
	JSON.parse('que')
} catch (e) {
	console.log(haraldutil.eToString(e))
}
},

function shallowClone(require) {
var haraldutil = require('haraldutil')
console.log('Any value works:', haraldutil.shallowClone(undefined))
var o = {a: 'unchanged'}
var o1 = haraldutil.shallowClone(o)
o1.a = 'changed'
console.log('o:', o)
},

function cbCounter(require) {
var haraldutil = require('haraldutil')
var cbc = haraldutil.getCbCounter()
setTimeout(cbc.add(callback), 100)
setTimeout(cbc.add(callback), 100)

function callback() {
	if (cbc.isDone(arguments.callee))
		console.log('All callbacks completed.')
	else console.log('Not done yet...')
}
},

function getJsonStore(require) {
var haraldutil = require('haraldutil')
var store = haraldutil.getJsonStore({name: 'json'})
store[store.getNextId()] = {key: 'value'}
store.save()
},

]

demos.forEach(function (f) {
	demonstrate(f, realPath)
})

// utility

function demonstrate(func, relative) {
	console.log('\n===== ' + func.name + '\n')
	console.log(getSource(func))
	console.log()
	func(myRequire(relative))
}

function getSource(func) {
	var match = func.toString().match(/[^{]*\{([\s\S]*)\}/m)
	var source = match ? match[1].trim() : ''
	return source
}

// mock require
function myRequire(relative) {
	return function requireWrapper(module) {
		return require(relative)
	}
}