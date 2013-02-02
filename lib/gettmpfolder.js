// gettmpfolder.js
// get absolute path to a folder for temporary files
// © 2013 Harald Rudell <harald@therudells.com> MIT License

var gettype = require('./gettype')

// http://nodejs.org/api/path.html
var path = require('path')

exports.getTmpFolder = getTmpFolder
exports.getHomeFolder = getHomeFolder

/*
get path to a temporary folder like '/tmp'
throws exception if not found
return value: string: absolute path to a folder that exists
*/
function getTmpFolder() {
	var folder = path.join(getHomeFolder(), 'tmp')
	if (gettype.getType(folder) !== 1) {
		folder = process.env.TEMP
		if (!folder || gettype.getType(folder) !== 1) {
			folder = '/tmp'
			if (gettype.getType(folder) !== 1) throw new Error('Temporary folder could not be found at ~/tmp, $TEMP, /tmp')
		}
	}

	return folder
}

/*
get absolute path to home folder like "/home/user"
return value: string or possibly undefined
*/
function getHomeFolder() {
	return process.env[
		process.platform === 'win32' ?
		'USERPROFILE' :
		'HOME']
}
