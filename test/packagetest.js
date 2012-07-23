// packagetest.js
// test javascript and json syntax

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

module.exports = {
	testJsSyntax: testJsSyntax,
	parsePackageJson: parsePackageJson,
	parseGitignore: parseGitignore,
}

function testJsSyntax(test) {
	var libFolder = '../lib'
	fs.readdirSync(__dirname + '/' + libFolder).forEach(function (jsFile) {
		// if there is a syntax error, an exception will happen here
		var jsModule = require(libFolder + '/' + jsFile)
		// { mailconstructor: [Function: constructor] }
		// console.log(jsModule)
		test.ok(!!jsModule)
	})
	test.done()
}
function parsePackageJson(test) {
	var data = fs.readFileSync(__dirname + '/../package.json')
	var obj = JSON.parse(data)
	test.ok(!!obj)
	test.done()
}
function parseGitignore(test) {
	var expected = '/node_modules'
	var data = fs.readFileSync(__dirname + '/../.gitignore', 'utf-8')
	
	test.ok(data.indexOf(expected) != -1, '.gitignore missing:' + expected)
	test.done()
}