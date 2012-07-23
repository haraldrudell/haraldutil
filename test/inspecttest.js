// inspecttest.js
// nodeunit test for inspect.js

// imports
var inspect = require ('../lib/inspect').inspect
var doTest = require('../lib/dotest').doTest

// exports
module.exports = {
	testInspect: testInspect,
}

function testInspect(test) {
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	var tests = {
		'undefined': { value: undefined, expected: 'undefined' },
		'null': { value: null, expected: 'null' },
		'true': { value: true, expected: 'true' },
		'false': { value: false, expected: 'false' },
		'NaN': { value: NaN, expected: 'NaN' },
		'+Infinity': { value: Infinity, expected: '+Infinity' },
		'-Infinity': { value: -Infinity, expected: '-Infinity' },
		'Integer': { value: 3, expected: '3' },
		'Negative integer': { value: -2, expected: '-2' },
		'Float': { value: 3.14, expected: '3.14' },
		'String': { value: 'abc', expected: '\'abc\''},
		'Unprintable string': { value: '\u0000', expected: '\'*\''},
		'Function': { value: function f(a) {}, expected: 'function f:1'},
		'Array': { value: [ 1, 2 ], expected: '2:[ 1, 2 ]'},
		'undefined object primitive': { value: Object(undefined), expected: '{}'},
		'null object primitive': { value: Object(null), expected: '{}'},
		'Boolean object primitive': { value: Object(true), expected: 'Object(true)'},
		'Number object primitive': { value: Object(3), expected: 'Object(3)'},
		'String object primitive': { value: Object('abc'), expected: 'Object(\'abc\')'},
		'Empty object': { value: {}, expected: '{}'},
	}

	for (var testName in tests) {
		var testObject = tests[testName]
		var actual = inspect(testObject.value)
		doTest(test.equal, actual, testObject.expected, func + ':' + testName)
	}
	test.done()
}
