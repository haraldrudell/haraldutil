// test-createkey.js
// © Harald Rudell 2012

var createkey = require('../lib/createkey')
// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['Create Key:'] = {
	'Create key': function () {
		var a1 = 'a'
		var a2 = 'b'
		var expected = 'Q_' + a1 + 'Q_' + a2
		var actual = createkey.createKey('a', 'b')
		assert.equal(actual, expected)
	},
}