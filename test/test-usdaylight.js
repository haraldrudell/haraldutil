// test-usdaylight.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var usdaylight = require('../lib/usdaylight')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['UsDaylight:'] = {
	'Exports': function () {
		assert.exportsTest(usdaylight, 1)
	},
	'Summer': function () {
		var actual = usdaylight.isUsDaylightSavings(new Date(Date.UTC(2012, 6, 1, 10)))
		assert.equal(actual, true)
	},
	'Winter': function () {
		var actual = usdaylight.isUsDaylightSavings(new Date(Date.UTC(2012, 1, 1, 10)))
		assert.equal(actual, false)
	},
}
