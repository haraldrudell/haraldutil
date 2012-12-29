// test-fileutil.js
// © Harald Rudell 2012

var fileutil = require('../lib/fileutil')
var testedModule = fileutil
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var exportsCount = 3
var testedModuleType = 'object'
var exportsTypes = {}

var stsy = fs.statSync

exports['FileUtil:'] = {
	'Exports': function () {

		// if export count changes, we need to write more tests
		assert.equal(typeof testedModule, testedModuleType, 'Module type incorrect')
		assert.equal(Object.keys(testedModule).length, exportsCount, 'Export count changed')

		// all exports function
		for (var exportName in testedModule) {
			var actual = typeof testedModule[exportName]
			var expected = exportsTypes[exportName] || 'function'
			assert.equal(actual, expected, 'Incorrect type of export ' + exportName)
		}
	},
	'GetHomeFolder': function () {
		var expected = process.env[process.platform == 'win32' ?
			'USERPROFILE' :
			'HOME']
		var actual = fileutil.getHomeFolder()
		assert.equal(actual, expected)
	},
	'GetType': function () {
		var file = 'FILE'
		var directory = 'DIR'
		var notFound = 'ENOENT'
		var bad = 'EBAD'
		var statSyncResult
		var arg = 5

		fs.statSync = mockStatSync

		// file
		statSyncResult = file
		var actual = fileutil.getType(arg)
		assert.strictEqual(actual, true)

		// directory
		statSyncResult = directory
		var actual = fileutil.getType(arg)
		assert.strictEqual(actual, 1)

		// not found
		statSyncResult = notFound
		var actual = fileutil.getType(arg)
		assert.strictEqual(actual, undefined)

		// error
		statSyncResult = bad
		assert.throws(function () {
			fileutil.getType(arg)
		}, /EBAD/)

		fs.statSync = stsy

		function mockStatSync(path1) {
			assert.equal(path1, arg)
			if (statSyncResult.substring(0,1) == 'E') {
				var e = new Error(statSyncResult)
				e.code = statSyncResult
				throw e
			}
			return {
				isFile: function() {return statSyncResult == file},
				isDirectory: function() {return statSyncResult == directory},
			}
		}
	},
	'GetTmpFolder': function () {
		var thePath
		fs.statSync = mockStatSync

		// has ~/tmp
		thePath = path.join(fileutil.getHomeFolder(), 'tmp')
		var actual = fileutil.getTmpFolder(true)
		assert.equal(actual, thePath)

		// do not have ~/tmp
		thePath = path.join(fileutil.getHomeFolder(), 'tmp')
		var actual = fileutil.getTmpFolder(true)
		assert.equal(actual, thePath)

		// no folder
		thePath = ''
		assert.throws(function () {
			fileutil.getTmpFolder(true)
		}, /no tmp/)

		fs.statSync = stsy

		function mockStatSync(path1) {
			if (path1 != thePath) {
				var e = new Error('ENOENT')
				e.code = 'ENOENT'
				throw e
			}
			return {
				isDirectory: function () {return true},
				isFile: function () {return false},
			}
		}
	},
	'after': function () {
		fs.statSync = stsy
	},
}