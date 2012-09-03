// browseto.js
// open url in system browser
// © Harald Rudell 2012

// http://nodejs.org/api/child_process.html
var child_process = require('child_process')

exports.browseTo = browseTo

/*
launch a browser window displaying url
return value: child process object
*/
function browseTo(url) {
	var cmd =
		process.platform == 'win32' ? 'explorer.exe' :
		process.platform == 'darwin' ? 'open' :
		'xdg-open'

	//console.log('spawn', cmd, [url])
	return child_process.spawn(cmd, [url])
}