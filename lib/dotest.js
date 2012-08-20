// dotest.js
// execute assert functions providing actual and expected even when message is used

exports.doTest = doTest

/*
execute an assertion test
always print actual and expected, even if text is provided
print actual and expected on separate lines

f: an assert.x function
*/
function doTest(f) {
	var args = Array.prototype.slice.call(arguments, 0)
	args.shift() // skip the f argument
	try {
		f.apply(this, args)
	} catch (e) {
		if (e instanceof Error && // the exception value is an Error
			e.name == 'AssertionError' && // it is an assertion Error
			e.message) { // and message has been provided
			// an AssertionError has properties: name, message, actual, expected and operator

			// if we don't have the values in message, put them there
			if (e.message.indexOf(e.actual) == -1) {
				e.message = assertMessage(
					e.actual,
					e.expected,
					e.message,
					e.operator)
			}
		}
		throw e
	}
}

// code adapted from (node source folder)/lib/assert.js
function assertMessage(actual, expected, heading, operator) {
	result = []
	if (heading) result.push('Failing test:', heading, ' ')
	result.push(
		'actual value:\n',
		truncate(JSON.stringify(actual, replacer), 128),
		'\nexpected value:\n',
		truncate(JSON.stringify(expected, replacer), 128),
		'\noperation:',
		operator || '=='
	)
	return result.join('')

	function replacer(key, value) {
		if (value === undefined) return '' + value
		if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) return value.toString()
		if (typeof value === 'function' || value instanceof RegExp) return value.toString()
		return value
	}
	function truncate(s, n) {
		if (typeof s == 'string')  return s.length < n ? s : s.slice(0, n)
		return s
	}
}