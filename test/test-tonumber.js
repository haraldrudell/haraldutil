// test-tonumber.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var tonumber = require('../lib/tonumber')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['ToNumber:'] = {
	'Exports': function () {
		assert.exportsTest(tonumber, 1)
	},
	'Values': function () {
		var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
		var tests = {
			1: { str: '5,50:', expected: 'NaN'},
			3: { str: ' 5 ', expected: 5},
			4: { str: ' 50 ', expected: 50},
			5: { str: 50, expected: 50},
			6: { str: Object(50), expected: 50},
			7: { str: Object(' 50 '), expected: 50},
			8: { str: ' 5.51 ', expected: 5.51, flag: true},
			9: { str: ' 5 0 ', expected: 'NaN'},
			10: { str: '50x', expected: 'NaN'},
			11: { str: '5.0', expected: 'NaN'},
			12: { str: true, expected: 'NaN'},
			13: { str: null, expected: 'NaN'},
			14: { str: undefined, expected: 'NaN'},
			15: { str: {}, expected: 'NaN'},
			16: { str: '', expected: 'NaN'},
			17: { str: ' 5.51 ', expected: 'NaN'},
		}

		for (var name in tests) {
			var t = tests[name]
			var actual = tonumber.toNumber(t.str, t.flag)
			// assert does not work for NaN, so convert NaN to string
			if (actual != null && typeof actual.valueOf() == 'number' && isNaN(actual)) actual = 'NaN'
			assert.equal(actual, t.expected, func + ':' + name)
		}
	},
}
