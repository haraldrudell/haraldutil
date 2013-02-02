// test-gettmpfolder.js
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var gettmpfolder = require('../lib/gettmpfolder')

var gettype = require('../lib/gettype')

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

var gt = gettype.getType
var pe = process.env

exports['GetTmpFolder:'] = {
	'Exports': function () {
		assert.exportsTest(gettmpfolder, 2)
	},
	'GetHomeFolder': function () {
		var expected = process.env[process.platform === 'win32' ?
			'USERPROFILE' :
			'HOME']

		var actual = gettmpfolder.getHomeFolder()

		assert.equal(actual, expected)
	},
	'GetTmpFolder': function () {
		var expected = path.join(gettmpfolder.getHomeFolder(), 'tmp')

		gettype.getType = function mockGetType(x) {return 1}

		var actual = gettmpfolder.getTmpFolder()

		assert.equal(actual, expected)
	},
	'TEMP': function () {
		var testEnv = {
			TEMP: 'TEMP',
			USERPROFILE: 'USERPROFILE',
			HOME: 'HOME',
		}

		gettype.getType = function mockGetType(x) {return x === testEnv.TEMP ? 1 : undefined}

		process.env = testEnv
		var actual = gettmpfolder.getTmpFolder()
		process.env = pe

		assert.equal(actual, testEnv.TEMP)
	},
	'/tmp': function () {
		var expected = '/tmp'

		gettype.getType = function mockGetType(x) {return x === expected ? 1 : undefined}

		var actual = gettmpfolder.getTmpFolder()

		assert.equal(actual, expected)
	},
	'Exception': function () {
		gettype.getType = function mockGetType(x) {}

		assert.throws(function () {
			gettmpfolder.getTmpFolder()
		}, /Temporary/)
	},
	'after': function () {
		gettype.getType = gt
		process.env = pe
	}
}
