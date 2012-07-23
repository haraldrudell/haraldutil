// errutiltest.js
// nodeunit test for errutil.js

var errutil = require ('../lib/errutil')
var inspect = require('../lib/inspect')

module.exports = {
	testGetLocation: testGetLocation,
	testEToString: testEToString,
}

function testEToString(test) {
	var expected1 = 'SyntaxError: 123'
	var expected2 = 'extra: \'haha\''
	var e = SyntaxError('123')
	e.extra = 'haha'
	var actual = errutil.eToString(e)

	//[ 'arguments', 'stack', 'message', 'type' ]
	//console.log(Object.getOwnPropertyNames(e))
/*
SyntaxError: 123
    at SyntaxError (unknown source)
    at Object.testEToString (/home/foxyboy/Desktop/c505/node/haraldutil/test/errutiltest.js:18:10)
    at Object.<anonymous> (/usr/local/lib/node_modules/nodeunit/lib/core.js:235:16)
    at /usr/local/lib/node_modules/nodeunit/lib/core.js:235:16
    at Object.runTest (/usr/local/lib/node_modules/nodeunit/lib/core.js:69:9)
    at /usr/local/lib/node_modules/nodeunit/lib/core.js:117:25
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:508:13
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:118:13
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:129:25
    at /usr/local/lib/node_modules/nodeunit/deps/async.js:510:17
*/
//	console.log(actual)

	test.equal(typeof actual, 'string', 'return value not string, actual:' + typeof actual)
	test.ok(actual.indexOf(expected1) != -1, 'return value did not contain:\'' + expected1 + '\' actual:\'' + actual + '\'')
	test.ok(actual.indexOf(expected2) != -1, 'return value did not contain:\'' + expected2 + '\' actual:\'' + actual + '\'')
	test.done()
}

function testGetLocation(test) {
	var expected1 = 'file:errutiltest.js:'
	var expected2 = 'function:Object.func'
	var Obj = {}
	Obj.func = function() {
		return errutil.getLocation(true)
	}
	// 'file:errutiltest.js:20:18 function:Object.func'
	var actual = Obj.func()

	test.equal(typeof actual, 'string', 'return value not string, actual:' + typeof actual)
	test.ok(actual.indexOf(expected1) != -1, 'return value did not contain:\'' + expected1 + '\' actual:\'' + actual + '\'')
	test.ok(actual.indexOf(expected2) != -1, 'return value did not contain:\'' + expected2 + '\' actual:\'' + actual + '\'')
	test.done()
}