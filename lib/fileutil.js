// fileutil.js
// Determine if a path is file folder or nonexistent
// © Harald Rudell 2012

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

module.exports = {
	getType: getType,
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
			console.error('Exception for:', typeof path1, path1, path1 != null && path1.length)
			throw e
		}
	}
	if (stats) {
		if (stats.isFile()) result = true
		if (stats.isDirectory()) result = 1
	}
	return result
}