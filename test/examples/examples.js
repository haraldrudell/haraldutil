// examples.js
// haraldutil examples for readme
// © Harald Rudell 2012

var realPath = '../../lib/haraldutil'
var pPrepend = require(realPath).pPrepend

// code

var demos = [

function (require) {
var p = require('haraldutil').p
debugger
p('Printouts start with code location: file:line:function')
p('In an anonymous function like here, the function name is omitted')
someFunction()

function someFunction() {
	p('Leading string does format %s %d %j', {a:1}, {a:1}, {a:1})
	p(undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))
}
},

function (require) {
var ps = require('haraldutil').ps

console.log('ps is p without logging, it can output location:', ps())
},

function pargs(require) {
var haraldutil = require('haraldutil')
var pargs = haraldutil.pargs

someFunction(undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))

function someFunction() {
	pargs(arguments)
}
},

function (require) {
var haraldutil = require('haraldutil')
var p = haraldutil.p
var pPrepend = haraldutil.pPrepend

pPrepend(process.pid)
p('Launching of new process')

pPrepend(require('os').hostname() + ':' + process.pid)
p('Launching on new host')

},

function (require) {
var q = require('haraldutil').q

someFunction()

function someFunction() {
	q('q and qs are like p and ps but does haraldutil.inspect rather then util.format')
	q(undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))
}
},

function pp(require) {
var pp = require('haraldutil').pp

someFunction()

function someFunction() {
	pp(console)
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

/*
demos is the array of example functions

provide each example function to demonstrate
*/
demos.forEach(function (f) {
	demonstrate(f, realPath)
})

// utility

/*
Execute a demo function, print its source and output
func: a demo function
relative: the fully qualified path to where haraldutil can be found
*/
function demonstrate(func, relative) {
	console.log('\n=====', func.name)
	console.log(getSource(func))
	console.log()
	// myRequire is a function that will load haraldutil from our lib folder
	func(myRequire(relative))
	pPrepend()
}

function getSource(func) {
	var match = func.toString().match(/[^{]*\{([\s\S]*)\}/m)
	var source = match ? match[1].trim() : ''
	return source
}

// mock require
function myRequire(relative) {
	return function requireWrapper(module) {
		var result
		if (module == 'os') result = {hostname: function () {return 'somehostname'}}
		else result = require(relative)
		return result
	}
}