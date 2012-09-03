// test-browseto.js
// © Harald Rudell 2012

var browseto = require('../lib/browseto')
// http://nodejs.org/api/child_process.html
var child_process = require('child_process')
// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var _spawn

exports['BrowseTo:'] = {
	'before': function () {
		_spawn = child_process.spawn
	},
	'after': function () {
		child_process.spawn = _spawn
	},
	'Invocation': function() {
		var loc = 'URL'
		var expected = 17
		var eSpawn = [[
			process.platform == 'win32' ? 'explorer.exe' :
			process.platform == 'darwin' ? 'open' :
			'xdg-open',
			[loc]
		]]
		var aSpawn = []

		child_process.spawn = mockSpawn
		var actual = browseto.browseTo(loc)
		assert.equal(actual, expected)
		assert.deepEqual(aSpawn, eSpawn)

		function mockSpawn(cmd, url) {
			aSpawn.push([cmd, url])
			return expected
		}
	},
}