// test-usdaylight.js
// © Harald Rudell 2012 MIT License

var usdaylight = require('../lib/usdaylight')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['UsDaylight:'] = {
	'Exports': function () {
		assert.exportsTest(usdaylight, 0, null, 'function')
	},
	'DISABLED': function () {
	},
}