// test-timeutil.js
// test used with nodeutil

var haraldutil = require('../lib/haraldutil')
var assert = require('mochawrapper')

exports['GetDateString'] = {
	'Result': function () {
		var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
		var timestamp = 1317660120
		var tests = {
			1: { timezoneMinutesOffUtc: -240, expected: '2011-10-03T12:42-04'},
			2: { timezoneMinutesOffUtc: -0, expected: '2011-10-03T16:42Z'},
			3: { timezoneMinutesOffUtc: -420, modifier: 1, expected: '09:42-07'},
		}

		for (var name in tests) {
			var t = tests[name]
			var actual = haraldutil.getDateString(timestamp, t.timezoneMinutesOffUtc, t.modifier)
			assert.equal(actual, t.expected, func + ':' + name)
		}
	},
}

exports['ToNumber'] = {
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
			var actual = haraldutil.toNumber(t.str, t.flag)
			// assert does not work for NaN, so convert NaN to string
			if (actual != null && typeof actual.valueOf() == 'number' && isNaN(actual)) actual = 'NaN'
			assert.equal(actual, t.expected, func + ':' + name)
		}
	},
}

exports['GetISOPacific'] = {
	'Summer': function () {
		var summer = new Date('2012-07-01 10:00Z')
		var e = '2012-07-01T03:00-07'

		var actual = haraldutil.getISOPacific(summer)
		assert.equal(actual, e)
	},
	'Winter': function () {
		var winter = new Date('2012-01-01 10:00Z')
		var e = '2012-01-01T02:00-08'

		var actual = haraldutil.getISOPacific(winter)
		assert.equal(actual, e)
	},
}