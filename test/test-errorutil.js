// test-errorutil.js

var errorutil = require ('../lib/errorutil')
// http://nodejs.org/api/path.html
var path = require('path')

exports.testEToString = function (test) {
	var input = 5
	var expected = String(input)
	var actual = errorutil.eToString(input)
	test.strictEqual(actual, expected, 'eToString of non-Error')

	var expected1 = 'SyntaxError: 123'
	var expected2 = 'extra:\'haha\''
	var e = SyntaxError('123')
	e.extra = 'haha'
	var actual = errorutil.eToString(e)
/*
SyntaxError: 123
    at SyntaxError (unknown source)
    at Object.testEToString (/home/foxyboy/Desktop/c505/node/haraldutil/test/errorutiltest.js:18:10)
    at Object.<anonymous> (/usr/local/lib/node_modules/nodeunit/lib/core.js:235:16)
    at /usr/local/lib/node_modules/nodeunit/lib/core.js:235:16
    at Object.runTest (/usr/local/lib/node_modules/nodeunit/lib/core.js:69:9)
    at /usr/local/lib/node_modules/nodeunit/lib/core.js:117:25
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:508:13
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:118:13
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:129:25
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:510:17
*/
	test.equal(typeof actual, 'string', 'return value should be string')
	test.ok(actual.indexOf(expected1) != -1, 'return value did not contain:\'' + expected1 + '\' actual:\'' + actual + '\'')
	test.ok(actual.indexOf(expected2) != -1, 'return value did not contain:\'' + expected2 + '\' actual:\'' + actual + '\'')

	test.done()
}

exports.testGetLocation = function testGetLocation(test) {

	var expected1 = 'file:' + path.basename(__filename)
	var expected2 = 'folder:' + __dirname
	var expected3 = 'function:Object.exports.' + arguments.callee.name + '.Obj.func'
	var Obj = {}
	Obj.func = function() {
		return errorutil.getLocation(true)
	}
	// 'file:errorutiltest.js:20:18 function:Object.func'
	var actual = Obj.func()
	test.equal(typeof actual, 'string', 'getLocation return value not string')
	test.ok(actual.indexOf(expected1) != -1, 'return value did not contain:\'' + expected1 + '\' actual:\'' + actual + '\'')
	test.ok(actual.indexOf(expected2) != -1, 'return value did not contain:\'' + expected2 + '\' actual:\'' + actual + '\'')
	test.ok(actual.indexOf(expected3) != -1, 'return value did not contain:\'' + expected3 + '\' actual:\'' + actual + '\'')

	test.done()
}

exports.testGetLocationIncludeObject = function (test) {

	var expected1 = 'function:'
	var actual = errorutil.getLocation()
	test.ok(actual.indexOf(expected1) == -1, 'return value should not contain function:')

	var expected1 = 'function:'
	var actual = errorutil.getLocation(true)
	test.ok(actual.indexOf(expected1) != -1, 'return value should contain function:')

	test.done()
}

exports.testGetLocationOffset = function (test) {

	var expected1 = 'file:errorutil.js'
	// file:errorutil.js:91:41 function:Object.getLocation folder:/home/foxyboy/Desktop/c505/node/haraldutil/lib
	var actual = errorutil.getLocation(true, -1)
	test.ok(actual.indexOf(expected1) != -1, 'return value should not contain:\'' + expected1 + '\'')

	test.done()
}

exports.testGetLocationFormats = function (test) {

	var error = new Error
	error.stack = '    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:10:2)'
	var expected = 'file:mongotest.js:10:2 function:Object.<anonymous> folder:/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch'
	var actual = errorutil.getLocation(true, -2, error)
	test.equal(actual, expected)

	var error = new Error
	error.stack = '    at run (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:22:2)'
	var expected = 'file:mongotest.js:22:2 function:run folder:/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch'
	var actual = errorutil.getLocation(true, -2, error)
	test.equal(actual, expected)

	var error = new Error
	error.stack = '    at /home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:32:3'
	var expected = 'file:mongotest.js:32:3 folder:/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch'
	var actual = errorutil.getLocation(true, -2, error)
	test.equal(actual, expected)

	test.done()
}