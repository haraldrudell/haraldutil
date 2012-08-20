// test-escapechar.js

var escapechar = require('../lib/escapechar')

exports.testEscapeChar = function (test) {
	var input = ' \r \' \b \\ \f \n \t \v \u0000'
	var expected = ' \\r \\\' \\b \\ \\f \\n \\t \\v \\u0000'

	var actual = ''
	for (var index in input) actual += escapechar.escapedChar(input.charAt(index))
	test.equal(actual, expected)

	test.done()
}