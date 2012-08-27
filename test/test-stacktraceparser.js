// test-stacktraceparser.js
// © Harald Rudell 2012

var stacktraceparser = require('../lib/stacktraceparser')
var assert = require('mochawrapper')

/*
Error
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/haraldutil/lib/stacktraceparser.js:38:7)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)

sample frames:
in main: Object.<anonymous> (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:10:2)
in function: run (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:22:2)
in emit callback: /home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:32:3
*/

// {get: [Function], set: [Function], enumerable: false, configurable: true}
//console.log(Object.getOwnPropertyDescriptor(new Error, 'stack'))

// how each stack frame starts in the text
var frameLeadin = '\n\u0020\u0020\u0020\u0020at\u0020'

exports['FrameTypes:'] = {
	'main': function () {
		var e = new Error
		e.stack = 'x' + frameLeadin + 'Object.<anonymous> (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:10:2)'
		var expected = {
			message: 'x',
			frames: [{
				folder: '/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch',
				file: 'mongotest.js',
				line: 10,
				column: 2,
				func: 'Object.<anonymous>',
				text: 'Object.<anonymous> (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:10:2)',
			}],
		}
		var actual = stacktraceparser.parseTrace(e)
		assert.deepEqual(actual, expected)
	},
	'In function': function () {
		var e = new Error
		e.stack = 'x' + frameLeadin + 'run (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:22:2)'
		var expected = {
			message: 'x',
			frames: [{
				folder: '/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch',
				file: 'mongotest.js',
				line: 22,
				column: 2,
				func: 'run',
				text:'run (/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:22:2)',
			}],
		}
		var actual = stacktraceparser.parseTrace(e)
		assert.deepEqual(actual, expected)
	},
	'With as': function () {
		var e = new Error
		e.stack = 'x' + frameLeadin + 'Object.name [as alias] (/home/foxyboy/Desktop/c505/node/haraldutil/test/test-stacktraceparser.js:9:14)'
		var expected = {
			message: 'x',
			frames: [{
				folder:'/home/foxyboy/Desktop/c505/node/haraldutil/test',
				file: 'test-stacktraceparser.js',
				line: 9,
				column: 14,
				func: 'Object.name',
				as: 'alias',
				text:'Object.name [as alias] (/home/foxyboy/Desktop/c505/node/haraldutil/test/test-stacktraceparser.js:9:14)',
			}]
		}
		var actual = stacktraceparser.parseTrace(e)
		assert.deepEqual(actual, expected)
	},
	'Emit callback': function () {
		var e = new Error
		e.stack = 'x' + frameLeadin + '/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:32:3'
		var expected = {
			message: 'x',
			frames: [{
				folder:'/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch',
				file:'mongotest.js',
				line: '32',
				column: '3',
				text:'/home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:32:3',
			}]
		}
		var actual = stacktraceparser.parseTrace(e)
		assert.deepEqual(actual, expected)
	},
}