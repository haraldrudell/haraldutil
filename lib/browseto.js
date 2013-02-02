// browseto.js
// Open url in system browser
// © Harald Rudell 2012  <harald@allgoodapps.com> MIT License

// http://nodejs.org/api/child_process.html
var child_process = require('child_process')

exports.browseTo = browseTo

/*
Launch or open new tab in system browser displaying url
url: string url eg. 'http://allgoodapps.com'
cb(err, exitCode): optional function, result is integer exit code, 0 on good exit
*/
function browseTo(url, cb) {
	var cmd =
		process.platform === 'win32' ? 'explorer.exe' :
		process.platform === 'darwin' ? 'open' :
		'xdg-open'
	var child

	try {
		child = child_process.spawn(cmd, [url])
	} catch(e) {
		if (cb) cb(e)
		else throw e
	}
	if (child) child.once('exit', exitListener)

	function exitListener(exitCode) {
		var err
		if (exitCode) err = new Error('Command \'' + cmd + '\' return exit code: ' + exitCode)
		if (cb) cb(err, exitCode)
		else if (err) throw err
	}
}
