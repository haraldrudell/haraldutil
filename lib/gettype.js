// gettype.js
// Determine if a path is file folder or nonexistent
// © 2013 Harald Rudell <harald@therudells.com> MIT License

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

exports.getType = getType

/*
determine filesystem type of path1
path1: absolute path

return value:
undefined: path1 does not exist
1: path1 is a directory
true: path1 is a file
*/
function getType(path1) {
	var result

	var stats
	try {
		stats = fs.statSync(path1)
	} catch (e) { // ignore file not found exception
		if (!(e instanceof Error) || e.code !== 'ENOENT') throw e
	}

	if (stats) {
		if (stats.isFile()) result = true
		if (stats.isDirectory()) result = 1
	}

	return result
}
