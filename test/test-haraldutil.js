// test-haraldutil.js
// © 2011 Harald Rudell <harald@therudells.com> MIT License

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['HaraldUtil:'] = {
	'Require': function () {
		require('../lib/haraldutil')
	},
	'Exports': function () {
		assert.exportsTest(require('../lib/haraldutil'), 31)
	},
}
