// test-timeutil.js
// © Harald Rudell 2011 MIT License

var timeutil = require('../lib/timeutil')
var tonumber = require('../lib/tonumber')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['GetDateString'] = {
	'Exports': function () {
		assert.exportsTest(timeutil, 6)
	},
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
			var actual = timeutil.getDateString(timestamp, t.timezoneMinutesOffUtc, t.modifier)
			assert.equal(actual, t.expected, func + ':' + name)
		}
	},
}

exports['GetISOPacific'] = {
	'Summer': function () {
		var summer = new Date('2012-07-01 10:00Z')
		var e = '2012-07-01T03:00-07'

		var actual = timeutil.getISOPacific(summer)
		assert.equal(actual, e)
	},
	'Winter': function () {
		var winter = new Date('2012-01-01 10:00Z')
		var e = '2012-01-01T02:00-08'

		var actual = timeutil.getISOPacific(winter)
		assert.equal(actual, e)
	},
}