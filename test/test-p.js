// test-p.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var p = require('../lib/p')

var tonumber = require('../lib/tonumber')
// http://nodejs.org/api/path.html
var path = require('path')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var cl = console.log

exports['P:'] = {
	'Exports': function () {
		assert.exportsTest(p, 8)
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
			'"2"': '2',
			'({})': '{}',
			'new function Class(){this.a = 1}': '{ a: 1 }',
			'[3]': '[ 3 ]',
			'(function f(a) {})': '[Function: f]',
			'new Date(1357510355481)': 'Sun Jan 06 2013 14:12:35 GMT-0800 (PST)',
			'/a/g': '/a/g',
			'var e = new Error("bad");Object.defineProperty(e,"nonEnumerableProperty", {enumerable: false, value: 1}); e': '[Error: bad]',
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
	'Q': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title

		console.log = mockLog
		var actual = p.q()
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
	'Q Values': function () {
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
			var output = p.q(value)
			console.log = cl
			var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)

			assert.equal(actual, tests[expression])
		}
	},
	'PS': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title + ' { a: 1 } \'abc\''

		var actual = p.ps({a: 1}, 'abc')

		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
		var lineString = actual.slice(expected0.length, -expected1.length)

		var line = tonumber.toNumber(lineString)
		assert.ok(!isNaN(line) && line > 0, 'Bad line number: ' + line + ' from string: \'' + lineString + '\'')
	},
	'PARGS': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + f.name + ' 1, \'abc\', {a: 1}'

		console.log = mockLog
		var actual = f(1, 'abc', {a: 1})
		console.log = cl

		assert.ok(aLogs)
		assert.equal(typeof actual, 'string')
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
		var lineString = actual.slice(expected0.length, -expected1.length)

		var line = tonumber.toNumber(lineString)
		assert.ok(!isNaN(line) && line > 0, 'Bad line number: ' + line + ' from string: \'' + lineString + '\'')

		function f(a, b, c) {
			return p.pargs(arguments)
		}
		function mockLog(x) {
			aLogs++
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
		}

		for (var expression in tests) {
			var value = eval(expression)

			console.log = function () {}
			var output = p.pp(value)
			console.log = cl
			var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)

			assert.equal(actual, tests[expression])
		}

		console.log = function () {}
		var output = p.pp(/a/g)
		console.log = cl

		var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)

		var expect1 = '/a/g {\n'

		assert.equal(actual.substring(0, expect1.length), expect1)
		;[
			'  (nonE)lastIndex: 0',
			'  (nonE)global: true',
			'  (nonE)ignoreCase: false',
			'  (nonE)multiline: false',
			'  (nonE)source: \'a\'',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(str), str)
		})
		var expect2 = '}'
		assert.equal(actual.slice(-expect2.length), expect2)

		// error
		var e = new Error('bad')
		Object.defineProperty(e,'nonEnumerableProperty', {enumerable: false, value: 1})

		console.log = function () {}
		var output = p.pp(e)
		console.log = cl

		var actual = output.substring(output.indexOf(this.test.title) + this.test.title.length + 1)

		var expected0 = 'object:Error {'
		assert.equal(actual.substring(0, expected0.length), expected0)

		;[
			'  (nonE)(get)stack: Error: bad',
			'  (nonE)type: undefined',
			'  (nonE)nonEnumerableProperty: 1',
			'  (nonE)message: \'bad\'',

			'  (nonE)arguments: undefined',
			'  -- prototype: Error',
			'  (nonE)name: \'Error\'',
			'  (nonE)message: \'\'',
			'  (nonE)toString: function toString()',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(), str)
		})

		var expected1 = '}'
		assert.equal(actual.slice(-expected1.length), expected1)
	},
	'PPS': function () {
		var aLogs = 0
		var expected0 = path.basename(__filename, path.extname(__filename)) + ':'
		var expected1 = ':' + this.test.title + ' {\n  a: 1\n} \'abc\''

		var actual = p.pps({a: 1}, 'abc')

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
