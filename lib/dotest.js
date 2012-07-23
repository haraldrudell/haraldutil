// dotest.js

module.exports = {
	doTest: doTest,
}

function doTest(f, actual, expected, heading) {
	f(actual, expected,
		assertMessage(actual, expected, heading, f.name))

	// code from
	// (node source folder)/lib/assert.js
	function assertMessage(actual, expected, heading, operator) {
		result = []
		if (heading) result.push('failing test:', heading, ' ')
		result.push(
			'actual:',
			truncate(JSON.stringify(actual, replacer), 128),
			' expected:',
			truncate(JSON.stringify(expected, replacer), 128),
			' operation:',
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
}