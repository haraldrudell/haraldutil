// test-escapechar.js
// © Harald Rudell 2011 MIT License

var escapechar = require('../lib/escapechar')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['EscapeChar:'] = {
	'Exports': function () {
		assert.exportsTest(escapechar, 1)
	},
	'JavaScript escapes': function () {
		var input = ' \r \' \b \\ \f \n \t \v \u0000'
		var expected = ' \\r \\\' \\b \\ \\f \\n \\t \\v \\u0000'

		var actual = ''
		for (var index in input) actual += escapechar.escapedChar(input.charAt(index))
		assert.equal(actual, expected)
	},
}