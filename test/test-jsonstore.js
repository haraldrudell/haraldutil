// test-jsonstore.js
// © Harald Rudell 2012

var jsonstore = require('../lib/jsonstore')
var fileutil = require('../lib/fileutil')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')
// http://nodejs.org/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

var _rfs = fs.readFileSync
var _wf = fs.writeFile

exports['Json Store:'] = {
	'after': function () {
		fs.readFileSync = _rfs
		fs.writeFile = _wf
	},
	'Default invocation': function () {
		var data = {a: 1}
		var aRfs = []
		var eRfs = [[getTmp() + '/temp.json', 'utf-8']]

		fs.readFileSync = mockReadFileSync
		var actual = jsonstore.getJsonStore({})
		assert.equal(typeof actual.save, 'function')
		assert.equal(typeof actual.getNextId, 'function')
		// lose functions and such
		var actual2 = JSON.parse(JSON.stringify(actual))
		assert.deepEqual(actual2, data)
		assert.deepEqual(aRfs, eRfs)

		function mockReadFileSync(absolute, chset) {
			aRfs.push([absolute, chset])
			return JSON.stringify(data)
		}
	},
	'GetNextId': function () {
		var store = jsonstore.getJsonStore()
		assert.equal(store.getNextId(), 1)
		assert.equal(store.getNextId(), 2)
	},
	'Save': function (done) {
		var eWf = [[getTmp() + '/temp.json', '{"a":1}']]
		var aWf = []
		fs.writeFile = mockWriteFile
		var store = jsonstore.getJsonStore()
		store.a = 1
		store.save(cb)

		function cb(err) {
			assert.ok(!err)
			assert.deepEqual(aWf, eWf)

			done()
		}

		function mockWriteFile(name, data, cb) {
			aWf.push([name, data])
			cb()
		}
	},
}

exports['Json Store Name Option'] = {
	'after': function () {
		fs.readFileSync = _rfs
	},
	'Base filename': function () {
		var data = {a: 1}
		var name = 'NAME'
		var aRfs = []
		var eRfs = [[getTmp() + '/' + name + '.json', 'utf-8']]

		fs.readFileSync = mockReadFileSync
		var actual = jsonstore.getJsonStore({name: name})
		assert.deepEqual(aRfs, eRfs)

		function mockReadFileSync(absolute, chset) {
			aRfs.push([absolute, chset])
			return JSON.stringify(data)
		}
	},
	'Base filename and extension': function () {
		var data = {a: 1}
		var name = 'NAME.EXT'
		var aRfs = []
		var eRfs = [[getTmp() + '/' + name, 'utf-8']]

		fs.readFileSync = mockReadFileSync
		var actual = jsonstore.getJsonStore({name: name})
		assert.deepEqual(aRfs, eRfs)

		function mockReadFileSync(absolute, chset) {
			aRfs.push([absolute, chset])
			return JSON.stringify(data)
		}
	},
	'Filename and folder': function () {
		var data = {a: 1}
		var name = '/TEMP/NAME.EXT'
		var aRfs = []
		var eRfs = [[name, 'utf-8']]

		fs.readFileSync = mockReadFileSync
		var actual = jsonstore.getJsonStore({name: name})
		assert.deepEqual(aRfs, eRfs)

		function mockReadFileSync(absolute, chset) {
			aRfs.push([absolute, chset])
			return JSON.stringify(data)
		}
	},
}

exports['Json Store Emitter Option'] = {
	'after': function () {
		fs.readFileSync = _rfs
	},
	'default': function () {
		fs.readFileSync = mockReadFileSync
		assert.throws(function () {
			jsonstore.getJsonStore()
		}, function (err) {
			return err instanceof Error
		})

		function mockReadFileSync(absolute, chset) {
			throw Error('que')
		}
	},
	'false': function () {
		fs.readFileSync = mockReadFileSync
		var actual = jsonstore.getJsonStore({emitter: false})
		// lose functions and such
		var actual2 = JSON.parse(JSON.stringify(actual))
		assert.deepEqual(actual2, {})

		function mockReadFileSync(absolute, chset) {
			throw Error('que')
		}
	},
	'emitter': function () {
		var emits = 0
		fs.readFileSync = mockReadFileSync
		jsonstore.getJsonStore({emitter: {emit: mockEmit}})
		assert.equal(emits, 1)

		function mockEmit(type, err) {
			emits++
		}
		function mockReadFileSync(absolute, chset) {
			throw Error('que')
		}
	},
}

exports['Json Store Cb Option'] = {
	'after': function () {
		fs.readFileSync = _rfs
	},
	'Present': function () {
		var aCb = []
		fs.readFileSync = mockReadFileSync
		var actual = jsonstore.getJsonStore({}, callback)
		assert.equal(aCb.length, 1)
		assert.ok(aCb[0][0] instanceof Error)
		assert.deepEqual(aCb[0][1], actual)

		function callback(err, result) {
			aCb.push([err, result])
		}

		function mockReadFileSync(absolute, chset) {
			throw Error('que')
		}
	},
}
function getTmp() {
	var folder = path.join(getHomeFolder(), 'tmp')
	if (fileutil.getType(folder) !== 1) {
		folder = process.env.TEMP
		if (!folder || getType(folder) !== 1) folder = '.'
	}
	return folder
}

// get home folder like "/home/user"
function getHomeFolder() {
	return process.env[
		process.platform == 'win32' ?
		'USERPROFILE' :
		'HOME']
}