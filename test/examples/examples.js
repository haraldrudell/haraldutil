// examples.js
// haraldutil examples for readme
// © Harald Rudell 2012

var realPath = '../../lib/haraldutil'

// code

var demos = [

function p(require) {
var p = require('haraldutil').p

p('Printouts start with code location: file:line:function')
p('In an anonymous function, the function name is omitted')
someFunction()

function someFunction() {
	p('Value examples:', undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))
}
},

function pargs(require) {
var haraldutil = require('haraldutil')
var pargs = haraldutil.pargs

LogPrinter(undefined, 'abc', {a: 1, b: 2}, new Error('a'))

function LogPrinter() {
	pargs(arguments)
}
},

],x=[
function (require) {
var haraldutil = require('haraldutil')
var p = haraldutil.p

p('Leading source filename and line number, but no function name')
LogPrinter()

function LogPrinter() {
	p('Source filename, line number and function name')
}
},

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

function getHomeFolder(require) {
var haraldutil = require('haraldutil')
console.log('Home folder:', haraldutil.getHomeFolder())
},

function getTmpFolder(require) {
var haraldutil = require('haraldutil')
console.log('Tmp folder:', haraldutil.getTmpFolder())
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

function createKey(require) {
var haraldutil = require('haraldutil')
var dbServer = 'server'
var dbTable = 'table'
var dbTable2 = 'table2'
var key1 = haraldutil.createKey(dbServer, dbTable)
var key2 = haraldutil.createKey(dbServer, dbTable2)
if (key1 !== key2) console.log('not the same')
},

function periodString(require) {
var haraldutil = require('haraldutil')
console.log('The world will come to an end in:', haraldutil.periodString(1e7))
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