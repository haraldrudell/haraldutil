// fileutil.js
// Determine if a path is file folder or nonexistent
// © Harald Rudell 2012

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

exports.getType = getType
exports.getTmpFolder = getTmpFolder
exports.getHomeFolder = getHomeFolder

var cachedTmpFolder

/*
get path to a temporary folder like '/tmp'
throws ecception if not found
*/
function getTmpFolder(noCache) {
	var folder = !noCache ? cachedTmpFolder : false
	if (!folder) {
		folder = path.join(getHomeFolder(), 'tmp')
		if (getType(folder) !== 1) {
			folder = process.env.TEMP
			if (!folder || getType(folder) !== 1) {
				folder = '/tmp'
				if (getType(folder) !== 1) throw Error('no tmp folder found')
			}
		}
		cachedTmpFolder = folder
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
determine what path1 is
return value:
undefined: does not exist
1: is a directory
true: is a file
*/
function getType(path1) {
	var result
	var stats
	try {
		stats = fs.statSync(path1)
	} catch (e) {
		var bad = true
		if (e instanceof Error && e.code == 'ENOENT') bad = false
		if (bad) {
			//console.error('Exception for:', typeof path1, path1, path1 != null && path1.length)
			throw e
		}
	}
	if (stats) {
		if (stats.isFile()) result = true
		if (stats.isDirectory()) result = 1
	}
	return result
}