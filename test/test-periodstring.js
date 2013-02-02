// test-periodstring.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var periodstring = require ('../lib/periodstring')

// http://nodejs.org/api/path.html
var path = require('path')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var time1s = 1e3
var time1minute = 60 * time1s
var time1hour = 60 * time1minute
var time1day = time1hour * 24

exports['PeriodString:'] = {
	'Exports': function () {
		assert.exportsTest(periodstring, 1)
	},
	'values': function () {
		var values = {
			'0.000 s': 0.1,
			'3.141 s': 3141.5,
			'1 min 10 s': 70999,
			'1 h 25 min': time1hour + 25 * time1minute + 59 * time1s,
			'3 d 23 h': 3* time1day + 23 * time1hour + 59 * time1minute,
			'2.7 y': 1000 * time1day,
			'27 y': 10000 * time1day,
		}

		for (var expected in values) {
			var value = values[expected]
			var actual = periodstring.periodString(value)
			assert.equal(actual, expected, 'Value: ' + value)
		}
	},
}
