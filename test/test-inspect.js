// test-inspect.js
// © Harald Rudell 2011 MIT License

var inspect = require('../lib/inspect').inspect
var inspectAll = require('../lib/inspect').inspectAll
var inspectDeep = require('../lib/inspect').inspectDeep

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

// http://nodejs.org/api/util.html
var util = require('util')

exports['Inspect:'] = {
	'Exports': function () {
		assert.exportsTest(require('../lib/inspect'), 3)
	},
	'Primitives': function () {
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
			assert.equal(actual, testObject.expected, arguments.callee.name + ':' + testName)
		}
	},
	'Object primitives': function () {
		var tests = {
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
			assert.equal(actual, testObject.expected, arguments.callee.name + ':' + testName)
		}
	},
	'Date, Error, RegExp, JSON and empty object': function () {
		var tests = {
			'Empty object': { value: {}, expected: '{}'},
			'Date': { value: new Date(5), expected: 'Date(5)'},
			'Error': { value: new Error(), expected: 'object:Error {}'},
			'RegExp': { value: /5/g, expected: '/5/g'},
			'JSON': { value: JSON, expected: '{}'},
		}

		for (var testName in tests) {
			var testObject = tests[testName]
			var actual = inspect(testObject.value)
			assert.equal(actual, testObject.expected, arguments.callee.name + ':' + testName)
		}
	},
	'Array objects': function () {
		var tests = {
			'Empty array': { value: [], expected: '0[]'},
			'Single-value array': { value: [1], expected: '1[1]'},
			'Two-value array': { value: [1, 2], expected: '2[1, 2]'},
		}

		for (var testName in tests) {
			var testObject = tests[testName]
			var actual = inspect(testObject.value)
			assert.equal(actual, testObject.expected, arguments.callee.name + ':' + testName)
		}
	},
	'Function objects': function () {
		var tests = {
			'anonymous without arguments': { value: function () {}, expected: 'function ()'},
			'anonymous with arguments': { value: function (a) {}, expected: 'function (a)'},
			'named without arguments': { value: function f() {}, expected: 'function f()'},
			'named with arguments': { value: function f(a, b) {}, expected: 'function f(a, b)'},
		}

		for (var testName in tests) {
			var testObject = tests[testName]
			var actual = inspect(testObject.value)
			assert.equal(actual, testObject.expected, arguments.callee.name + ':' + testName)
		}
	},
	'Indentation': function () {
		var input = {a:{b:{c:2}}}

		var actual = inspect(input, {maxLevels: null})
		var expected =
			'{\n' +
			'  a: {\n' +
			'    b: {\n' +
			'      c: 2\n' +
			'    }\n' +
			'  }\n' +
			'}'
		assert.equal(actual, expected, arguments.callee.name)
	},
	'FunctionProperty': function () {
		var input = function a(a) {}
		input.prop = 5
		var expected =
			'function a(a) {\n' +
			'  prop: 5\n' +
			'}'
		var actual = inspect(input)
		assert.equal(actual, expected, arguments.callee.name)
	},
	'RecursiveObject': function () {
		var input = {}
		input.field = input
		var expected =
			'{\n' +
			'  field: recursive-object#1\n' +
			'}'
		var actual = inspect(input)
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Option NoArrayLength': function () {
		var input = [5]
		var expected = '[5]'
		var actual = inspect(input, {noArrayLength:true})

		assert.equal(actual, expected, arguments.callee.name)
	},
	'Option MaxString': function () {
		var input = 'abc'

		var actual = inspect(input)
		var expected = '\'abc\''
		assert.equal(actual, expected, arguments.callee.name)

		var actual = inspect(input, {maxString:2})
		var expected = '\'ab...\''
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Option MaxProperties': function () {
		var tests = {
			'unabbreviated object': { value: {0:'a', 1:'B', 2:'C', 4:'D'}, expected: '{\n  0: \'a\',\n  1: \'B\',\n  2: \'C\',\n  4: \'D\'\n}'},
			'abbreviated object': { value: {0:'a', 1:'b', 2:'c', 3:'d'}, expected: '{\n  0: \'a\',\n  ...,\n  3: \'d\'\n}'},
			'unabbreviated array': { value: [1], expected: '1[1]'},
			'at-limit array': { value: [1, 2], expected: '2[1, 2]'},
			'still unabbreviated array': { value: [1, 2, 3], expected: '3[1, 2, 3]'},
			'abbreviated array': { value: [1, 2, 3, 4], expected: '4[1, ..., 4]'},
		}

		for (var testName in tests) {
			var testObject = tests[testName]
			var actual = inspect(testObject.value, {maxProperties:1})
			assert.equal(actual, testObject.expected, arguments.callee.name + ':' + testName)
		}
	},
	'Option MaxLevels': function () {
		var input = {a:{b:2}}

		var actual = inspect(input)
		var expected =
			'{\n' +
			'  a: {\n' +
			'    b: 2\n' +
			'  }\n' +
			'}'
		assert.equal(actual, expected, arguments.callee.name)

		var actual = inspect(input, {maxLevels:1})
		var expected =
			'{\n' +
			'  a: {...}\n' +
			'}'
		assert.equal(actual, expected, arguments.callee.name)

		var actual = inspect(input, {maxLevels:0})
		var expected =
			'{...}'
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Option singleLine': function () {
		var input = {a: {b: 2, c: 3}}
		var expected = '{a: {b: 2, c: 3}}'

		var actual = inspect(input, {singleLine: true})
		assert.equal(actual, expected, arguments.callee.name)
	},
}
exports['Option NonEnumerable:'] = {
	'Primitive Objects': function () {
		var input = Object(false)
		var actual = inspect(input, {nonEnum:true})

		var expect1 = 'Object(false) {\n  -- prototype: Boolean,\n'
		assert.equal(actual.substring(0, expect1.length), expect1)
		;[
			'  (nonE)valueOf: function valueOf()',
			'  (nonE)toString: function toString()',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(str), str)
		})
		var expect2 = '}'
		assert.equal(actual.slice(-expect2.length), expect2)

		var input = Object(5)
		var actual = inspect(input, {nonEnum:true})

		var expect1 = 'Object(5) {\n  -- prototype: Number,\n'
		assert.equal(actual.substring(0, expect1.length), expect1)
		;[
			'  (nonE)toFixed: function toFixed()',
			'  (nonE)toLocaleString: function toLocaleString()',
			'  (nonE)valueOf: function valueOf()',
			'  (nonE)toPrecision: function toPrecision()',
			'  (nonE)toString: function toString()',
			'  (nonE)toExponential: function toExponential()',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(str), str)
		})
		var expect2 = '}'
		assert.equal(actual.slice(-expect2.length), expect2)

		var input = Object('abc')
		var actual = inspect(input, {nonEnum:true})

		var expect1 = 'Object(\'abc\'),\n  (nonE)length: 3,\n'
		assert.equal(actual.substring(0, expect1.length), expect1)
		;[
			'  -- prototype: String',
			'  (nonE)fontcolor: function fontcolor()',
			'  (nonE)localeCompare: function localeCompare()',
			'  (nonE)big: function big()',
			'  (nonE)lastIndexOf: function lastIndexOf()',
			'  (nonE)replace: function replace()',
			'  (nonE)fontsize: function fontsize()',
			'  (nonE)charCodeAt: function charCodeAt()',
			'  (nonE)trimRight: function trimRight()',
			'  (nonE)blink: function blink()',
			'  (nonE)search: function search()',
			'  (nonE)concat: function concat()',
			'  (nonE)trimLeft: function trimLeft()',
			'  (nonE)substring: function substring()',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(str), str)
		})
		var expect2 = '}'
		assert.equal(actual.slice(-expect2.length), expect2)

	},
	'Object object': function () {
		var input = {a: 1}
		var expected = '{\n  a: 1\n}'
		var actual = inspect(input, {nonEnum:true})
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Function': function () {
		var input = function f(a) {}
		var expected = 'function f(a)'
		var actual = inspect(input, {nonEnum:true})
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Array': function () {
		var input = [5]
		var expected = '1[5, (nonE)length: 1]'
		var actual = inspect(input, {nonEnum:true})
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Date': function () {
		var input = new Date(5)
		var expected = 'Date(5)'
		var actual = inspect(input, {nonEnum:true})
		assert.equal(actual, expected, arguments.callee.name)
	},
	'RegExp': function () {
		var input = /5/g

		var actual = inspect(input, {nonEnum:true})

		var expect1 = '/5/g {\n'
		assert.equal(actual.substring(0, expect1.length), expect1)
		;[
			'  (nonE)lastIndex: 0',
			'  (nonE)global: true',
			'  (nonE)ignoreCase: false',
			'  (nonE)multiline: false',
			'  (nonE)source: \'5\'',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(str), str)
		})
		var expect2 = '}'
		assert.equal(actual.slice(-expect2.length), expect2)
	},
	'Error': function () {
		var input = new Error('abc')

		var actual = inspect(input, {nonEnum:true, maxString:0})

		var e0 = 'object:Error {\n'
		assert.equal(actual.substring(0, e0.length), e0)
		;[

			'  (nonE)(get)stack: Error: abc',
			'  (nonE)type: undefined',
			'  (nonE)message: \'abc\'',
			'  (nonE)arguments: undefined',
			'  -- prototype: Error',
			'  (nonE)name: \'Error\'',
			'  (nonE)message: \'\'',
			'  (nonE)toString: function toString()',
		].forEach(function (str) {
			assert.ok(~actual.indexOf(), str)
		})
		var expect2 = '}'
		assert.equal(actual.slice(-expect2.length), expect2)
	},
	'JSON': function () {
		var input = JSON
		var expected = '{\n  (nonE)parse: function parse(),\n  (nonE)stringify: function stringify()\n}'
		var actual = inspect(input, {nonEnum:true})
		assert.equal(actual, expected, arguments.callee.name)
	},
	'Buffer': function () {
		if (Buffer) {
			var input = new Buffer(10)
			setBufferContent(input)
			setBufferContent(input.parent)
			var i = input.parent
			var expect = [
				'object:Buffer {\n  0: 5,\n  1: 6,\n  2: 7,\n  3: 8,\n  4: 9,\n  ...,\n  9: 99,\n',
				'  length: 10,\n',
			]
			expect.push(util.format('  parent: object:SlowBuffer {\n    0: 5,\n    1: 6,\n    2: 7,\n    3: 8,\n    4: 9,\n    ...,\n    8191: 99,\n    used: %s,\n    length: 8192\n  },\n  offset: %s\n}',
				input.parent.used,
				input.offset))
			var actual = inspect(input, {nonEnum:true, maxProperties: 5})
			expect.forEach(function (s) {
				assert.ok(~actual.indexOf(s), arguments.callee.name + s)
			})
		}

		function setBufferContent(input) {
			for (var x = 0; x < 5; x++) input[x] = x + 5
			input[input.length - 1] = 99
		}
	},
	'Getter field': function () {
		var input = {}
		input.__defineGetter__('get', function getter() { return 5})
		var expected =
			'{\n' +
			'  (get)get: 5\n' +
			'}'
		var actual = inspect(input, {nonEnum:true})
		assert.equal(actual, expected, arguments.callee.name)
	},
	'PrototypeChain': function () {

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
			'  bfield: \'bField\',\n' +
			'  -- prototype: B,\n' +
			'  bp: \'BPrototypeField\',\n' +
			'  -- prototype: A,\n' +
			'  ap: \'APrototypeField\'\n' +
			'}'

		var actual = inspect(b, {nonEnum:true})

		assert.equal(actual, expected, arguments.callee.name)
	},
}

exports['InspectAll:'] = {
	'Global object without exception': function () {
		var actual = inspectAll(getGlobalObject())
	}
}
function getGlobalObject() {
	return this
}

function spaces(n) {
	var result = ''
	var spaces = '\u0020'
	n |= 0 // convert to 32-bit integer
	if (n > 0) for (;;) {
		if (n & 1) result += spaces
		if (!(n >>>= 1)) break
		spaces += spaces
	}
	return result
}