// test-timeutil.js
// © 2011 Harald Rudell <harald@therudells.com> MIT License

var timeutil = require('../lib/timeutil')
var tonumber = require('../lib/tonumber')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['TimeUtil'] = {
	'Exports': function () {
		assert.exportsTest(timeutil, 2)
	},
	'GetISOPacific Summer': function () {
		var summer = new Date('2012-07-01 10:00Z')
		var e = '2012-07-01T03:00-07'

		var actual = timeutil.getISOPacific(summer)
		assert.equal(actual, e)
	},
	'GetISOPacific Winter': function () {
		var winter = new Date('2012-01-01 10:00Z')
		var e = '2012-01-01T02:00-08'

		var actual = timeutil.getISOPacific(winter)
		assert.equal(actual, e)
	},
}
