// test-fileutil.js
// © Harald Rudell 2012

var fileutil = require('../lib/fileutil')
// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['FileUtil:'] = {
	'Directory': function () {
		var expected = 1
		var actual = fileutil.getType(__dirname)
		assert.strictEqual(actual, expected, 'directory fails')
	},
	'File': function () {
		var expected = true
		var actual = fileutil.getType(__filename)
		assert.strictEqual(actual, expected, 'file fails')
	},
	'Not existing': function () {
		var expected = undefined
		var actual = fileutil.getType(__filename+ '.xx')
		assert.strictEqual(actual, expected, 'not found fails')
	},
}