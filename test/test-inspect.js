// test-inspect.js

var inspect = require ('../lib/inspect').inspect
var doTest = require('../lib/dotest').doTest

exports.testPrimitives = function (test) {
	var tests = {
		'undefined': { value: undefined, expected: 'undefined' },
		'null': { value: null, expected: 'null' },
		'false': { value: false, expected: 'false' },
		'true': { value: true, expected: 'true' },
		'NaN': { value: NaN, expected: 'NaN' },
		'+Infinity': { value: Infinity, expected: '+Infinity' },
		'-Infinity': { value: -Infinity, expected: '-Infinity' },
		'Integer 0': { value: 0, expected: '0' },
		'Integer 1': { value: 1, expected: '1' },
		'Integer': { value: 3, expected: '3' },
		'Negative integer': { value: -2, expected: '-2' },
		'Float': { value: 3.14, expected: '3.14' },
		'String': { value: 'abc', expected: '\'abc\''},
		'Unprintable string': { value: '\u0000', expected: '\'\\u0000\''},
	}

	for (var testName in tests) {
		var testObject = tests[testName]
		var actual = inspect(testObject.value)
		doTest(test.equal, actual, testObject.expected, arguments.callee.name + ':' + testName)
	}

	test.done()
}

exports.testSimpleObjects = function (test) {
	var tests = {
		'Function': { value: function f(a) {}, expected: 'function f:1'},
		'Array': { value: [ 1, 2 ], expected: '2:[1, 2]'},
		'undefined object primitive': { value: Object(undefined), expected: '{}'},
		'null object primitive': { value: Object(null), expected: '{}'},
		'Boolean object primitive': { value: Object(true), expected: 'Object(true)'},
		'Number object primitive': { value: Object(3), expected: 'Object(3)'},
		'String object primitive': { value: Object('abc'), expected: 'Object(\'abc\')'},
		'Empty object': { value: {}, expected: '{}'},
		'Date': { value: new Date(5), expected: 'Date(5)'},
		'Error': { value: new Error(), expected: 'object:Error {}'},
	}

	for (var testName in tests) {
		var testObject = tests[testName]
		var actual = inspect(testObject.value)
		doTest(test.equal, actual, testObject.expected, arguments.callee.name + ':' + testName)
	}

	test.done()
}

exports.testIndentation = function (test) {
	var input = {a:{b:{c:2}}}

	var actual = inspect(input, {maxLevels:0})
	var expected =
		'{\n' +
		'  a:{\n' +
		'    b:{\n' +
		'      c:2\n' +
		'    }\n' +
		'  }\n' +
		'}'
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}

exports.testFunctionProperty = function  (test) {
	var input = function a(a) {}
	input.prop = 5
	var expected =
		'function a:1 {\n' +
		'  prop:5\n' +
		'}'
	var actual = inspect(input)
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()

}

exports.testRecursiveObject = function  (test) {
	var input = {}
	input.field = input
	var expected =
		'{\n' +
		'  field:recursive-object#1\n' +
		'}'
	var actual = inspect(input, {nonEnum:true})
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()

}

exports.testOptionNoArrayLength = function (test) {
	var input = [5]
	var expected = '[5]'
	var actual = inspect(input, {noArrayLength:true})

	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}

exports.testOptionMaxString = function (test) {
	var input = 'abc'

	var actual = inspect(input)
	var expected = '\'abc\''
	doTest(test.equal, actual, expected, arguments.callee.name)

	var actual = inspect(input, {maxString:2})
	var expected = '\'ab...\''
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}

exports.testOptionMaxProperties = function (test) {
	var input = {a:1, b:2}

	var actual = inspect(input)
	var expected =
		'{\n' +
		'  a:1,\n' +
		'  b:2\n' +
		'}'
	doTest(test.equal, actual, expected, arguments.callee.name)

	var actual = inspect(input, {maxProperties:1})
	var expected =
		'{\n' +
		'  a:1,\n' +
		'  ...\n' +
		'}'
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}

exports.testOptionMaxLevels = function (test) {
	var input = {a:{b:2}}

	var actual = inspect(input)
	var expected =
		'{\n' +
		'  a:{\n' +
		'    b:2\n' +
		'  }\n' +
		'}'
	doTest(test.equal, actual, expected, arguments.callee.name)

	var actual = inspect(input, {maxLevels:1})
	var expected =
		'{\n' +
		'  a:{...}\n' +
		'}'
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}

exports.testOptionNonEnumerableField = function (test) {
	// function
	var input = function f(a) {}
	var expected = 'function f:1'
	var actual = inspect(input, {nonEnum:true})
	doTest(test.equal, actual, expected, arguments.callee.name)

	// array
	var input = [5]
	var expected = '1:[5, (nonE)length:1]'
	var actual = inspect(input, {nonEnum:true})
	doTest(test.equal, actual, expected, arguments.callee.name)

	// getter field
	var input = {}
	input.__defineGetter__('get', function getter() { return 5})
	var expected =
		'{\n' +
		'  (get)get:5\n' +
		'}'
	var actual = inspect(input, {nonEnum:true})
	doTest(test.equal, actual, expected, arguments.callee.name)

	// Error
	var input = Error('abc')
	var expected =
		'object:Error {\n' +
		'  (nonE)(get)stack:\'Error: abc\\n    at Error (unknown source...\',\n' +
		'  (nonE)type:undefined,\n' +
		'  (nonE)message:\'abc\',\n' +
		'  (nonE)arguments:undefined\n' +
		'}'
	var actual = inspect(input, {nonEnum:true})
	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}

exports.testPrototypeChain = function (test) {

	function A () {}
	A.prototype.ap = 'APrototypeField'

	function B() {}
	B.prototype = new A
	B.prototype.constructor = B
	B.prototype.bp = 'BPrototypeField'

	var b = new B
	b.bfield = 'bField'

	var expected =
		'object:B {\n' +
		'  bfield:\'bField\',\n' +
		'  -- prototype:B,\n' +
		'  bp:\'BPrototypeField\',\n' +
		'  -- prototype:A,\n' +
		'  ap:\'APrototypeField\'\n' +
		'}'

	var actual = inspect(b, {nonEnum:true})

	doTest(test.equal, actual, expected, arguments.callee.name)

	test.done()
}