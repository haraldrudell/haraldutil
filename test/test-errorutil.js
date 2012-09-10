// test-errorutil.js
// © Harald Rudell 2012

var errorutil = require ('../lib/errorutil')
// http://nodejs.org/api/path.html
var path = require('path')
// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['EToString:'] = {
	'non-Error argument': function () {
		var input = 5
		var expected = String(input)
		var actual = errorutil.eToString(input)
		assert.strictEqual(actual, expected, 'eToString of non-Error')
	},
	'Error argument': function () {
		var expected1 = 'SyntaxError: 123'
		var expected2 = 'extra: \'haha\''
		var e = SyntaxError('123')
		e.extra = 'haha'

		var actual = errorutil.eToString(e)
		/*
		SyntaxError: 123
		    at SyntaxError (unknown source)
		    at Object.testEToString (/home/foxyboy/Desktop/c505/node/haraldutil/test/errorutilassert.js:18:10)
		    at Object.<anonymous> (/usr/local/lib/node_modules/nodeunit/lib/core.js:235:16)
		    at /usr/local/lib/node_modules/nodeunit/lib/core.js:235:16
		    at Object.runTest (/usr/local/lib/node_modules/nodeunit/lib/core.js:69:9)
		    at /usr/local/lib/node_modules/nodeunit/lib/core.js:117:25
		    at /usr/local/lib/node_modules/nodeunit/deps/async.js:508:13
		    at /usr/local/lib/node_modules/nodeunit/deps/async.js:118:13
		    at /usr/local/lib/node_modules/nodeunit/deps/async.js:129:25
		    at /usr/local/lib/node_modules/nodeunit/deps/async.js:510:17
		*/
		assert.equal(typeof actual, 'string', 'return value should be string')
		assert.ok(~actual.indexOf(expected1), 'return value did not contain:\'' + expected1 + '\' actual:\'' + actual + '\'')
		assert.ok(~actual.indexOf(expected2), 'return value did not contain:\'' + expected2 + '\' actual:\'' + actual + '\'')
	},
	'noTrace': function () {
		var expected = 'SyntaxError: 123\n' +
			'extra: \'haha\''
		var e = SyntaxError('123')
		e.extra = 'haha'

		var actual = errorutil.eToString(e, false)
		assert.equal(actual, expected)
	},
}

exports['GetLocation:'] = {
	'Basic Invocation': function () {
		var expected = [
			'file: ' + path.basename(__filename),
			'folder: ' + __dirname,
			'exports.' + this.test.parent.title + '.' + this.test.title,
			'function: ',
		]
		var actual = errorutil.getLocation()
		assert.equal(typeof actual, 'string')
		expected.forEach(function (str) {
			assert.ok(~actual.indexOf(str), 'return value did not contain:\n\'' + str + '\'\nactual:\n\'' + actual + '\'', false)
		})
	},
	'.object option': function () {
		var expected1 = 'function: '
		var actual = errorutil.getLocation({object: false})
		assert.ok(!~actual.indexOf(expected1))
	},
	'.folder option': function () {
		var expected1 = 'folder: '
		var actual = errorutil.getLocation({folder: false})
		assert.ok(!~actual.indexOf(expected1))
	},
	'.err option without new': function () {
		var expected = [
			'function: ',
			'exports.' + this.test.parent.title + '.' + this.test.title,
			'folder: ' + __dirname,
			'file: ' + path.basename(__filename),
		]

		var e = Error('que')
//console.log(require('../lib/stacktraceparser').parseTrace(e))
		var actual = errorutil.getLocation({err: e})
		assert.equal(typeof actual, 'string')
		expected.forEach(function (str) {
			assert.ok(~actual.indexOf(str), 'return value did not contain:\n\'' + str + '\'\nactual:\n\'' + actual + '\'', false)
		})
	},
	'.err option with new': function () {
		var expected = [
			'function: ',
			'exports.' + this.test.parent.title + '.' + this.test.title,
			'folder: ' + __dirname,
			'file: ' + path.basename(__filename),
		]

		var e = new Error('que')
//console.log(require('../lib/stacktraceparser').parseTrace(e))
		var actual = errorutil.getLocation({err: e})
		assert.equal(typeof actual, 'string')
		expected.forEach(function (str) {
			assert.ok(~actual.indexOf(str), 'return value did not contain:\n\'' + str + '\'\nactual:\n\'' + actual + '\'', false)
		})
	},
	'.offset option': function () {
		var expected = 'function: f'
		var err = f()
		// file:errorutil.js:91:41 function:Object.getLocation folder:/home/foxyboy/Desktop/c505/node/haraldutil/lib
		var actual = errorutil.getLocation({err: err, offset: 1})
		assert.ok(~actual.indexOf(expected), 'return value should contain:\'' + expected + '\'\nactual:\n\'' + actual + '\'', false)

		function f(a) {
			return g()

			function g(b) {
				return new Error
			}
		}
	},
}