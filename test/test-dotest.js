// test-dotest.js

var dotest = require('../lib/dotest')
var assert = require('assert')

exports.testAssertEqual = function (test) {

	// should do nothing
	assert.equal(true, true)

	// assert without a message: works fine
	var exception
	try {
		assert.equal(false, true)
	} catch (e) {
		exception = e
	}
	test.ok(exception, 'assert.equal(false, true) did not throw exception')
	var actual = getFirstStackTraceLine(exception)
	var expected = 'AssertionError: false == true'
	test.equal(actual, expected)

	// assert with message: does not print values
	// this is what dotest fixes!
	var input = 'que'
	var exception
	try {
		assert.equal(false, true, input)
	} catch (e) {
		exception = e
	}
	test.ok(exception, 'assert.ok(false, true, "que") did not throw exception')
	var actual = getFirstStackTraceLine(exception)
	var expected = 'AssertionError: que'
	test.equal(actual, expected)

	test.done()
}

exports.testDoTest = function (test) {

	// should do nothing
	dotest.doTest(assert.equal, true, true)

	// assert without a message: works fine
	var exception
	try {
		dotest.doTest(assert.equal, false, true)
	} catch (e) {
		exception = e
	}
	test.ok(exception, 'dotest(assert.equal, false, true) did not throw exception')
	var actual = getFirstStackTraceLine(exception)
	var expected = 'AssertionError: false == true'
	test.equal(actual, expected)

	// assert with message: now has values!
	var input = 'que'
	var exception
	try {
		dotest.doTest(assert.equal, false, true, input)
	} catch (e) {
		exception = e
	}
	test.ok(exception, 'dotest(assert.ok, false, true, "que") did not throw exception')
	var actual = getFirstStackTraceLine(exception)
	var expected =
		'AssertionError: Failing test:que actual value:\n' +
		'false\n' +
		'expected value:\n' +
		'true\n' +
		'operation:=='
	test.equal(actual, expected)

	test.done()
}

function getFirstStackTraceLine(e) {
	if (!(e instanceof Error)) throw Error(arguments.callee.name + ': code problem: argument is not Error')
debugger
	var stack = e.stack
	if (typeof stack != 'string') throw Error(arguments.callee.name + ': code problem: Error.stack not string')
	var lines = stack.split('\n')
	var result = []
	lines.every(function (line) {
		var end = line.substring(0, 7) == '    at '
		if (!end) result.push(line)
		return !end
	})
	return result.join('\n')
}