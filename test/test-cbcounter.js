// test-cbcounter.js
// © Harald Rudell 2012

var cbcounter = require('../lib/cbcounter')
// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['Callback Counter:'] = {
	'Add and isDone': function () {
		var cbc = cbcounter.getCbCounter()
		assert.equal(cbc.add(f), f)
		assert.equal(cbc.add(f), f)
		assert.equal(cbc.isDone(f), false)
		assert.equal(cbc.isDone(f), true)

		function f() {}
	},
	'getState': function () {
		var anonymous = function () {}
		var anonymous2 = function () {}
		var expected = {
			'anonymous': 1,
			'anonymous #2': 1,
			'f()': 1}

		var cbc = cbcounter.getCbCounter()
		assert.equal(cbc.add(f), f)
		assert.equal(cbc.add(anonymous), anonymous)
		assert.equal(cbc.add(anonymous2), anonymous2)
		assert.deepEqual(cbc.getState(), expected)

		function f() {}
	},
}

exports['Callback Counter Errors:'] = {
	'Unknown Function': function () {
		var cbc = cbcounter.getCbCounter()
		assert.throws(function() {
			cbc.isDone(function f () {})
		}, function (err) {
			return err instanceof Error
		})
	},
	'Too many isDone': function () {
		var cbc = cbcounter.getCbCounter()
		assert.equal(cbc.add(f), f)
		assert.equal(cbc.isDone(f), true)
		assert.throws(function() {
			cbc.isDone(f)
		}, function (err) {
			return err instanceof Error
		})

		function f() {}
	},
}

exports['Callback Counter Options:'] = {
	'Emitter false': function () {
		var expected = {}

		var cbc = cbcounter.getCbCounter({emitter: false})
		assert.equal(cbc.isDone(1), true)
	},
	'Emitter object': function () {
		var emits = 0

		var cbc = cbcounter.getCbCounter({emitter: {emit: mockEmit}})
		assert.equal(cbc.isDone(function () {}), true)
		assert.equal(emits, 1)

		function mockEmit() {
			emits++
		}
	},
	'Callback function': function () {
		var expected = {'f()': 1}

		var cbc = cbcounter.getCbCounter({callback: f})
		assert.deepEqual(cbc.getState(), expected)

		function f() {}
	},
	'Callback Array': function () {
		var expected = {'f()': 2}

		var cbc = cbcounter.getCbCounter({callback: [f, f]})
		assert.deepEqual(cbc.getState(), expected)

		function f() {}
	},
}