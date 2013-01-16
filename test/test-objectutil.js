// test-objectutil.js
// © Harald Rudell 2012 MIT License

var objectutil = require('../lib/objectutil')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['ObjectUtil:'] = {
	'Exports': function () {
		assert.exportsTest(objectutil, 2)
	},
	'DISABLED': function () {
	},
}