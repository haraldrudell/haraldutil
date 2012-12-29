// test-p.js
// © Harald Rudell 2012

var p = require('../lib/p')
var testedModule = p

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var exportsCount = 3
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
		var v = {a: 5}
		var expected0 = 'test-p:'
		var expected1 = ':P { a: 5 }'

		console.log = mockLog
		var actual = p.p(v)
		console.log = cl

		assert.equal(aLogs, 1)
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)

		function mockLog(x) {
			aLogs++
		}
	},
	'PS': function () {
		var v = {a: 5}
		var expected0 = 'test-p:'
		var expected1 = ':PS { a: 5 }'

		var actual = p.ps(v)
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)
	},
	'PP': function () {
		var aLogs = 0
		var v = {a: 5}
		var expected0 = 'test-p:'
		var expected1 = ':PP 0: {\n  a:5\n}'

		console.log = mockLog
		var actual = p.pp(v)
		console.log = cl

		assert.equal(aLogs, 1)
		assert.equal(actual.substring(0, expected0.length), expected0)
		assert.equal(actual.slice(-expected1.length), expected1)

		function mockLog(x) {
			aLogs++
		}
	},
	'after': function () {
		console.log = cl
	},
}