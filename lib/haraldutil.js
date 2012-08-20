// haraldutil.js

// http://nodejs.org/docs/latest/api/child_process.html
var spawn = require('child_process').spawn

module.exports = merge({
		toNumber: toNumber,
		merge: merge,
		browseTo: browseTo,
	},
	require('./fileutil'),
	require('./errorutil'),
	require('./timeutil'),
	require('./inspect'),
	require('./dotest')
)

// parse numbers, NaN if trailing non-numeric characters
// str: string: format: [+-]0-9..[.0-9..]
// allowFloat: optional boolean: allow decimal part, default no
// leading and trailing whitespace and line terminators are allowed
// bad numbers return NaN
function toNumber(str, allowFloat) {
	var result = NaN

	if (str != null) if (typeof str.valueOf() == 'string') {

		// skip leading and trailing whiteSpace and lineTerminator
		var digits = str.trim()

		if (isNumberSyntaxOk(digits, allowFloat)) result = allowFloat ? parseFloat(digits) : parseInt(digits)
	} else if (typeof str.valueOf() == 'number') result = Number(str)

	return result
}

// check syntax: only digits allowed, one possible decimal point
// str: string
// return value: true if number syntax is ok
function isNumberSyntaxOk(str, allowFloat) {
	var result = str.length > 0 // empty string not ok
	var sawDecimalPoint = false

	for (var index in str) {
		var value = "0123456789.-+".indexOf(str.charAt(index))

		// digit: ok
		if (value >= 0 && value < 10) continue

		// one decimal point: ok if float
		if (value == 10 && allowFloat && !sawDecimalPoint) {
			sawDecimalPoint = true
			continue
		}

		// leading plus or minus: ok
		if ((value == 11 || value == 12) && index == 0) continue

		// bad character
		result = false
		break
	}

	return result
}

// create an object with the enumerable properties of all provided arguments
// same name properties from later objects overwrite
// return value: Object object with only enumerable properties
function merge() {
	var result = {}
	Array.prototype.slice.call(arguments, 0).forEach(function (argument) {
		for (var property in argument) result[property] = argument[property]
	})
	return result
}

// launch a browser window displaying url
function browseTo(url) {
	var cmd =
		process.platform == 'win32' ? 'explorer.exe' :
		process.platform == 'darwin' ? 'open' :
		'xdg-open'

	//console.log('spawn', cmd, [url])
	spawn(cmd, [url])
}