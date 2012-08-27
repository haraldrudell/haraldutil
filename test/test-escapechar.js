// test-escapechar.js

var escapechar = require('../lib/escapechar')
var assert = require('mochawrapper')

exports['EscapeChar:'] = {
	'JavaScript escapes': function () {
		var input = ' \r \' \b \\ \f \n \t \v \u0000'
		var expected = ' \\r \\\' \\b \\ \\f \\n \\t \\v \\u0000'

		var actual = ''
		for (var index in input) actual += escapechar.escapedChar(input.charAt(index))
		assert.equal(actual, expected)
	},
}