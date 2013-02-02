// createkey.js
// Provide unique identifiers based on strings
// © 2012 Harald Rudell <harald@therudells.com> MIT License

exports.createKey = createKey

function createKey() {
	var result = ''
	var badIndex

	// true if false was never returned
	if (!Array.prototype.slice.call(arguments).every(function (value, index) {
		var ok = value && typeof value.valueOf() === 'string'
		if (ok) result += '__' + value.replace(/_/g, '_z')
		else badIndex = index
		return ok
	})) throw Error('Argument not string at index: ' + badIndex)

	return result
}