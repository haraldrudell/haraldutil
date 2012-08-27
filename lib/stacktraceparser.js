// stacktraceparser.js
// extract the information  node.js puts into a stack trace
// © Harald Rudell 2012

// http://nodejs.org/api/path.html
var path = require('path')

exports.parseTrace = parseTrace
/*
in node.js:
The Error constructor has a native function captureStackTrace.
Error objects has a non-enumerable getter property stack.
console.trace() uses these functions to print a stack trace to the console

The stack property is text. It starts with a message and may have trailing stack frames
each stack frame starts with a newline, four spaces, 'at' and another space
it ends with fields for code location, as expression and source file with line and column number
*/
var message = '(.*)'

// how each stack frame starts as text
var frameLeadin = '\n\u0020\u0020\u0020\u0020at\u0020'

// matcher piece for :line:col
var lineCol = ':(\\d+):(\\d+)'

// matcher for how a parenthesis enclosed filename ends
// 1: filename, 2:line, 3:column
var parenthesisLineColEnd = new RegExp('^(.*) \\((.*)' + lineCol + '\\)$')

// matcher for how line:col ends
// 1:line 2:column
var lineColEnd = new RegExp(lineCol + '$')

// matcher for an ending parenthesis
var parenthesisEnd = /^(.*)\(.*\)$/

// matcher for ending as expression
// 1: leading text, 2: as function name
var asEnd = /^(.*)\[as (.*)\]$/

var objectFunction = '(|[^\u0020]*\u0020)'
var asExpression = '(|[^\u0020]*\u0020)'
var frameRegExp = new RegExp(
	frameLeadin + // each frame starts with newline and at
	 objectFunction + // optional Object.
	'(' + asExpression + ')'
	, 'gm')

/*
Extract data from a stack trace
e: Error object
return value: object or undefined if the stack could not be parsed
.message: string: the leading error message
.frames: array of object: captured stack traces

each frame:
.func: Object.function expression in the code
.as: function name if different from property name
.folder: optional string if a folder other than current directory, absolute path to folder where source file is located, '/home/user'
.file: optional string source file name, 'script.js'
.line: optional number: 10
.column optional number: 5
.source: optional string: text that may appear eg. 'unknown source'
.text: string: this frame as text. contains no newlines and has the leading at removed
*/
function parseTrace(e) {
	var result

	// get the error message string
	if (e instanceof Error && e.hasOwnProperty('stack')) {
		var trace = e.stack
		if (typeof trace == 'string') {

			// parse the stack frames
			var indexList = getIndexArray(trace)
			indexList.push(trace.length)

			var frames = []
			for (var index = 0; index < indexList.length - 1; index++) {
				frames.push(parseFrame(trace.substring(indexList[index] + frameLeadin.length, indexList[index + 1])))
			}
			if (!~frames.indexOf(false)) { // success!
				result = {
					message: trace.substring(0, indexList[0]),
					frames: frames,
				}
			}
		}
	}
	return result
}

// parse out the components of the string stack frame str
function parseFrame(str) {
	var result = false
	var o = {text: str}
	for (;;) {

		// try '*(filename:line:col)'
		var match = parenthesisLineColEnd.exec(str)
		if (match) {
			parseFolderAndFile(o, match[2])
			parseLineAndColumn(o, match[3], match[4])
			parseFunctionAndAs(o, match[1])
			break
		}

		// try '*filename:line:col'
		var match = lineColEnd.exec(str)
		if (match) {
			parseLineAndColumn(o, match[1], match[2])
			var str = str.substring(0, match.index)
			// we know there is a filename
			// 'Object.function\u0020[as function]\u0020filename'
			// property names can contain spaces
			// filenames can contain anything
			// lets assume there are no slashes in Object.function
			// and no space before the first slash of filename
			var file
			var pos = str.indexOf('/')
			if (~pos) {
				if (pos == 0) {
					file = str
					str = ''
				} else {
					pos = str.substring(0, pos).lastIndexOf(' ')
					if (~pos) {
						file = str.substring(pos + 1)
						str = str.substring(0, pos - 1)
					}
				}
			}
			if (file) parseFolderAndFile(o, file)
			if (str) parseFunctionAndAs(o, str)
			break
		}

		// try '*(text)'
		var match = parenthesisEnd.exec(str)
		if (match) {
			// some string that is not a filename, 'unknown source'
			o.source = match[2]
			parseFunctionAndAs(o, match[1])
			break
		}

		parseFunctionAndAs(o, str)
	}
	return o
}

function parseFunctionAndAs(result, text) {

	// look for end with [as f]
	var match = asEnd.exec(text)
	if (match) {
		result.as = match[2]
		text = match[1]
	}
	result.func = text.trim()
}

function parseLineAndColumn(result, line, column) {
	result.line = parseInt(line)
	result.column = parseInt(column)
}

function parseFolderAndFile(result, text) {
	var folder = path.dirname(text)
	if (folder != '.') result.folder = folder
	result.file = path.basename(text)
}

// get a list of positions where a stack frame appears in the string str
function getIndexArray(str) {
	var result = []
	pos = 0
	for (;;) {
		var pos = str.indexOf(frameLeadin, pos)
		if (!~pos) break
		result.push(pos)
		pos += frameLeadin.length
	}
	return result
}