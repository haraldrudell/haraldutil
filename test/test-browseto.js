// test-browseto.js
// © Harald Rudell 2012 MIT License

var browseto
try {
	browseto = require('../lib/browseto')
} catch (e) {
	browseto = require('../lib/example/browseto')
}

// http://nodejs.org/api/child_process.html
var child_process = require('child_process')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var _spawn= child_process.spawn
var pp = process.platform

exports['BrowseTo:'] = {
	'Exports': function () {
		assert.exportsTest(browseto, 1)
	},
	'BrowseTo': function() {
		child_process.spawn = function mockSpawn(c, a) { return {
			once: function (e, f) {return this}
		}}

		browseto.browseTo()
	},
	'Platforms and Url': function() {
		var platforms = {
			win32: 'explorer.exe',
			darwin: 'open',
			linux: 'xdg-open',
		}
		var url = 'URL'

		var aCmd = []
		child_process.spawn = function mockSpawn(c, a) {aCmd.push([c, a]); return {
			once: function (e, f) {return this}
		}}

		for (var platform in platforms) {
			aCmd = []
			process.platform = platform
			browseto.browseTo(url)
			assert.deepEqual(aCmd, [[platforms[platform], [url]]], platform)
		}

		process.platform = pp
	},
	'Child Throw': function() {
		child_process.spawn = function mockSpawn(c, a) {throw Error('bad')}

		assert.throws(function () {
			browseto.browseTo()
		}, /bad/)

		browseto.browseTo('', callback)

		function callback(err, exitCode) {
			assert.ok(err)
			assert.ok(/bad/.test(err.message))
		}
	},
	'ExitCode': function() {
		child_process.spawn = function mockSpawn(c, a) {return {
			once: function (e, f) {f(1)}
		}}

		assert.throws(function () {
			browseto.browseTo()
		}, /exit code: 1/)

		browseto.browseTo('', callback)

		function callback(err, exitCode) {
			assert.ok(err)
			assert.ok(/exit code: 1/.test(err.message))
		}
	},
	'after': function () {
		child_process.spawn = _spawn
		process.platform = pp
	}
}