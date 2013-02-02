// test-timenumber.js
// © 2013 Harald Rudell <harald@therudells.com> MIT License

var timenumber = require('../lib/timenumber')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['TimeNumber'] = {
	'Exports': function () {
		assert.exportsTest(timenumber, 1)
	},
	'EncodeTimeNumber': function () {
		timenumber.encodeTimeNumber()
	},
	'ET Comparison': function () {
		var t1 = timenumber.encodeTimeNumber(0, 0, -240)
		var t2 = timenumber.encodeTimeNumber(1, 0, -240)
		assert.ok(t1 < t2)
	},
}
