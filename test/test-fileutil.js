// test-fileutil.js

var fileutil = require('../lib/fileutil')

exports.testFileUtil = function (test) {
	var expected = false
	var actual = fileutil.getType(__dirname)
	test.strictEqual(actual, expected, 'directory fails')

	var expected = true
	var actual = fileutil.getType(__filename)
	test.strictEqual(actual, expected, 'file fails')

	var expected = undefined
	var actual = fileutil.getType(__filename+ '.xx')
	test.strictEqual(actual, expected, 'not found fails')

	test.done()
}