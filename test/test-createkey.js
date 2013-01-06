// test-createkey.js
// © Harald Rudell 2012

var createkey = require('../lib/createkey')
// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['Create Key:'] = {
	'Same': function () {
		var a1 = 'a'
		var a2 = 'a'

		var a1key = createkey.createKey(a1, a2)
		var a2key = createkey.createKey(a2, a1)
		assert.equal(a1key, a2key)
	},
	'Different': function () {
		var a1 = 'a'
		var a2 = 'b'

		var a1key = createkey.createKey(a1, a2)
		var a2key = createkey.createKey(a2, a1)
		assert.notEqual(a1key, a2key)
	},
}