// test-fileutil.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var gettype = require('../lib/gettype')

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var stsy = fs.statSync

exports['GetType:'] = {
	'Exports': function () {
		assert.exportsTest(gettype, 1)
	},
	'GetType': function () {
		fs.statSync = function mockStatSync() {}

		var actual = gettype.getType()

		assert.equal(actual, undefined)
	},
	'File': function () {
		var path1 = 'PATH1'

		var aPath1 = []
		var ePath1 = [path1]
		fs.statSync = function mockStatSync(p) {aPath1.push(p); return {
			isFile: function mockIsFile() {return true},
			isDirectory: function mockIsDirectory() {return false},
		}}

		var actual = gettype.getType(path1)

		assert.equal(actual, true)
		assert.deepEqual(aPath1, ePath1)
	},
	'Directory': function () {
		fs.statSync = function mockStatSync(p) {return {
			isFile: function mockIsFile() {return false},
			isDirectory: function mockIsDirectory() {return true},
		}}

		var actual = gettype.getType()

		assert.equal(actual, 1)
	},
	'Not Found': function () {
		var e = new Error('bad')
		e.code = 'ENOENT'

		fs.statSync = function mockStatSync(p) {throw e}

		var actual = gettype.getType()

		assert.equal(actual, undefined)
	},
	'Exception': function () {
		var e = new Error('bad')

		fs.statSync = function mockStatSync(p) {throw e}

		assert.throws(function () {
			gettype.getType()
		}, /bad/)
	},
	'after': function () {
		fs.statSync = stsy
	}
}
