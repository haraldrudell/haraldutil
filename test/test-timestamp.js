// test-timestamp.js
// © 2013 Harald Rudell <harald@therudells.com> MIT License

var timestamp = require('../lib/timestamp')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['TimeStamp'] = {
	'Exports': function () {
		assert.exportsTest(timestamp, 3)
	},
	'GetDateString': function () {
		var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
		var aTimestamp = 1317660120
		var tests = {
			1: { timezoneMinutesOffUtc: -240, expected: '2011-10-03T12:42-04'},
			2: { timezoneMinutesOffUtc: -0, expected: '2011-10-03T16:42Z'},
			3: { timezoneMinutesOffUtc: -420, modifier: 1, expected: '09:42-07'},
		}

		for (var name in tests) {
			var t = tests[name]
			var actual = timestamp.getDateString(aTimestamp, t.timezoneMinutesOffUtc, t.modifier)
			assert.equal(actual, t.expected, func + ':' + name)
		}
	},
}
