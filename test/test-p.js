// test-p.js
// © Harald Rudell 2012

var p = require('../lib/p')
var testedModule = p

var tonumber = require('../lib/tonumber')
// http://nodejs.org/api/path.html
var path = require('path')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var exportsCount = 6
var testedModuleType = 'object'
var exportsTypes = {}

var cl = console.log

exports['P:'] = {
	'Exports': function () {

		// if export count changes, we need to write more tests
		assert.equal(typeof testedModule, testedModuleType, 'Module type incorrect')
		assert.equal(Object.keys(testedModule).length, exportsCount, 'Export count changed')

		// all exports function
		for (var exportName in testedModule) {
			var actual = typeof testedModule[exportName]
			var expected = exportsTypes[exportName] || 'function'
			assert.equal(actual, expected, 'Incorrect type of export ' + exportName)
		}
	},
	'P': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title

		console.log = mockLog
		var actual = p.p()
		console.log = cl

		assert.ok(aLogs)
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
		var lineString = actual.slice(expected0.length, -expected1.length)

		var line = tonumber.toNumber(lineString)
		assert.ok(!isNaN(line) && line > 0, 'Bad line number: ' + line + ' from string: \'' + lineString + '\'')

		function mockLog(x) {
			aLogs++
		}
	},
	'P Values': function () {
		var tests = {
			'undefined': 'undefined',
			'null': 'null',
			'false': 'false',
			'1': '1',
			'"1"': '\'1\'',
			'({})': '{}',
			'new function Class(){this.a = 1}': 'object:Class {a: 1}',
			'[1]': '1[1]',
			'(function f(a) {})': 'function f(a)',
			'new Date(1357510355481)': '2013-01-06T22:12:35.481Z',
			'/a/g': '/a/g',
			'var e = new Error("bad");Object.defineProperty(e,"nonEnumerableProperty", {enumerable: false, value: 1}); e': 'Error: bad {nonEnumerableProperty: 1}',
		}

		for (var expression in tests) {
			var value = eval(expression)

			console.log = function () {}
			var output = p.p(value)
			console.log = cl
			var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)

			assert.equal(actual, tests[expression])
		}
	},
	'PS': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title + ' {a: 1}'

		var actual = p.ps({a: 1})

		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
		var lineString = actual.slice(expected0.length, -expected1.length)

		var line = tonumber.toNumber(lineString)
		assert.ok(!isNaN(line) && line > 0, 'Bad line number: ' + line + ' from string: \'' + lineString + '\'')
	},
	'PARGS': function () {
		var expected = '1 \'abc\' {a: 1}'

		var actual = f(1, 'abc', {a: 1})
		assert.equal(typeof actual, 'string')
		assert.equal(actual, expected)

		function f(a, b, c) {
			return p.pargs(arguments)
		}
	},
	'PPrepend': function () {
		var value = 'PREPEND'
		var expected = '1 \'abc\' {a: 1}'

		var actual = p.pPrepend(value)

		assert.equal(typeof actual, 'string')
		assert.equal(actual, value)

		console.log = function () {}
		var actual = p.p('?')
		console.log = cl
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, value.length), value)

		var actual = p.ps('?')
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, value.length), value)

		console.log = function () {}
		var actual = p.pp('?')
		console.log = cl
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, value.length), value)

		var actual = p.pps('?')
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, value.length), value)

		p.pPrepend(undefined)
	},
	'PP': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title

		console.log = mockLog
		var actual = p.pp()
		console.log = cl

		assert.ok(aLogs)
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
		var lineString = actual.slice(expected0.length, -expected1.length)

		var line = tonumber.toNumber(lineString)
		assert.ok(!isNaN(line) && line > 0, 'Bad line number: ' + line + ' from string: \'' + lineString + '\'')

		function mockLog(x) {
			aLogs++
		}
	},
	'PP Values': function () {
		var tests = {
			'undefined': 'undefined',
			'null': 'null',
			'false': 'false',
			'1': '1',
			'"1"': '\'1\'',
			'({})': '{}',
			'new function Class(){this.a = 1}': 'object:Class {\n  a: 1\n}',
			'[1]': '1[1, (nonE)length: 1]',
			'(function f(a) {})': 'function f(a)',
			'new Date(1357510355481)': 'Date(1357510355481)',
			'/a/g': '/a/g {\n  (nonE)lastIndex: 0,\n  (nonE)global: true,\n  (nonE)source: \'a\',\n  (nonE)ignoreCase: false,\n  (nonE)multiline: false\n}',
		}

		for (var expression in tests) {
			var value = eval(expression)

			console.log = function () {}
			var output = p.pp(value)
			console.log = cl
			var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)

			assert.equal(actual, tests[expression])
		}

		// error
		var e = new Error('bad')
		Object.defineProperty(e,'nonEnumerableProperty', {enumerable: false, value: 1})
		var expected0 = 'object:Error {\n  (nonE)(get)stack: Error: bad,\n'
		var expected1 = ',\n  (nonE)type: undefined,\n  (nonE)nonEnumerableProperty: 1,\n  (nonE)message: \'bad\',\n  (nonE)arguments: undefined,\n  -- prototype: Error,\n  (nonE)name: \'Error\',\n  (nonE)message: \'\',\n  (nonE)toString: function toString()\n}'

		console.log = function () {}
		var output = p.pp(e)
		console.log = cl

		var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
	},
	'PPS': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title + ' {\n  a: 1\n}'

		var actual = p.pps({a: 1})

		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
		var lineString = actual.slice(expected0.length, -expected1.length)

		var line = tonumber.toNumber(lineString)
		assert.ok(!isNaN(line) && line > 0, 'Bad line number: ' + line + ' from string: \'' + lineString + '\'')
	},
	'after': function () {
		console.log = cl
	},
}