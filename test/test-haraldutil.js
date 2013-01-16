// test-haraldutil.js
// © Harald Rudell 2011 MIT License

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['HaraldUtil:'] = {
	'Require': function () {
		require('../lib/haraldutil')
	},
	'Exports': function () {
		assert.exportsTest(require('../lib/haraldutil'), 30)
	},
}