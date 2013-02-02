// test-objectutil.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var objectutil = require('../lib/objectutil')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['ObjectUtil:'] = {
	'Exports': function () {
		assert.exportsTest(objectutil, 2)
	},
	'Merge': function () {
		var o1 = {a:1}
		var o2 = {b:2}
		var expected = {a:1, b:2}

		var actual = objectutil.merge(o1, o2)

		assert.deepEqual(actual, expected)
	},
	'ShallowClone': function () {
		var o1 = {a:1}
		var expected = {a:1}

		var actual = objectutil.shallowClone(o1)
		o1.b = 2

		assert.deepEqual(actual, expected)
	},
}
