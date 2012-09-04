// jsonstore.js
// store and retrieve json data in the filesystem
// © Harald Rudell 2012

var fileutil = require('./fileutil')
// http://nodejs.org/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

exports.getJsonStore = getStore

/*
Create a store object
intended for small amounts of json data
opts: object
.name: string filename
- default name is 'temp'
- default extension is .json
- default folder is a suitable temp folder
.emitter: optional error emitter, default: errors are thrown
- false: errors are ignored
cb: optional callback

return value: store object
.save(cb(err)): save to disk
.getNextId(): gets a new serial number
*/
function getStore(opts, cb) {
	if (opts == null) opts = {}
	var result
	var err

	// get absolute path
	var absolute = opts.name || 'temp'
	if (!~absolute.indexOf('.')) absolute += '.json'
	absolute = path.resolve(getTmp(), absolute)

	// get store data
	if ((result = loadJson(absolute)) instanceof Error) {
		reportError(err = result, typeof cb == 'function')
		result = {}		
	}

	// merge in behavior
	result.save = save
	result.getNextId = getNextId

	if(cb) cb(err, result)

	return result

	function save(callback) {
		var jsonString = JSON.stringify(this)
		fs.writeFile(absolute, jsonString, function (err) {
			if (err) reportError(err)
			if (callback) callback(err)
		})
	}
	
	function getNextId() {
		if (!this.nextId) this.nextId = 0
		return ++this.nextId
	}

	function reportError(err, noThrow) {
		if (opts.emitter && typeof opts.emitter.emit == 'function') opts.emitter.emit('error', err)
		else if (opts.emitter !== false && !noThrow) throw err
	}
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

/*
Load json from absolute

return value: Object object
if file not found: empty object
if error: instanceof Error
*/
function loadJson(absolute) {
	var result = {}
	try {
		result = JSON.parse(fs.readFileSync(absolute, 'utf-8'))
	} catch (e) {
		var bad = true

		if (e instanceof Error  && e.code == 'ENOENT') bad = false
		if (bad) {
			var syntax = e instanceof SyntaxError
			if (syntax) e = SyntaxError('Bad syntax in property file:' + path + '\n' + e)
			result = e
		}
	}
	return result
}