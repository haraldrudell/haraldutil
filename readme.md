# haraldutil
Utility functions for time, errors, numbers and more.

## Benefits

2. Save on troubles and code lines with well tested, often sought functions.
1. Immediately find printout statements by having file and function names.
4. See the exact type of values with hidden properties and full prototype chains.
4. Separate printouts from multiple instances by preceding with process id or host.
3. Enhanced app portability across Linux, Mac and Windows.

## Features

1. Conversion of any value to printable string representation.
2. Object manipulation methods.
3. Portable path, number and browser-launch functions.
4. Error and stack trace parsers and string conversions.
5. JavaScript time value, Unix timestamp and timezone functions.

# Reference

### p(...)
Printout with code location and inspect of values
```js
var p = require('haraldutil').p

p('Printouts start with code location: file:line:function')
p('In an anonymous function, the function name is omitted')
someFunction()

function someFunction() {
  p('Value examples:', undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))
}
```
```
examples:14:p 'Printouts start with code location: file:line:function'
examples:15:p 'In an anonymous function, the function name is omitted'
examples:19:someFunction 'Value examples:' undefined '1' object:Class {a: 1} function stringify() Error: a
```

### pargs(arguments)
Prints the argument list for a function
```js
var haraldutil = require('haraldutil')
var pargs = haraldutil.pargs

LogPrinter(undefined, 'abc', {a: 1, b: 2}, new Error('a'))

function LogPrinter() {
  pargs(arguments)
}

```
```
examples:30:LogPrinter undefined 'abc' {a: 1, b: 2} Error: a
```
### inspectDeep(v)
Provides prototype chains, and unlimited strings. Abbreviates array-type properties at 10 elements.

```js
var haraldutil = require('haraldutil')
console.log(haraldutil.inspectDeep(console))
```
```
{
  info:function (),
  log:recursive-object#2,
  error:function (),
  time:function (label),
  warn:recursive-object#3,
  dir:function (object),
  trace:function (label),
  assert:function (expression),
  timeEnd:function (label)
}
```

### inspect(v, optsArg)
Prints any value in a way that conveys both value and type. The value is articulate and will not contain unprintable characters.

```js
var haraldutil = require('haraldutil')
var a = 'abcdefghijklm'.split('')
console.log(haraldutil.inspect(a))
```
```
13:['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', ..., 'm']
```
By default, the following steps shorten the printout
* Strings are shortened at 80 characters
* Non-enumerable properties or prototype chains are not printed
* Array-like properties are abbrevieted at 10 elements
* Max 2 levels of object properties are printed

optsArg
* maxString: optional number, default 80
* maxProperties: optional number, default 10
* maxLevels: optional number, default 2
* nonEnum: optional boolean, default false
* noArrayLength: optional boolean, default true: do not print array length

### inspectAll(v)
provide unique all-encompassing string describing value and type.

### merge(o1, o2, ...)
Create an object constructed using the enumerable properties of all provided arguments.

```js
var haraldutil = require('haraldutil')
console.log(haraldutil.merge({a: 1}, {a: 2, b: 2}, {c: 3}))
```
```
{ a: 2, b: 2, c: 3 }
```
* same name properties from later objects overwrite
* return value: Object object with only enumerable properties

### shallowClone(object)
Create a shallow copy of an object
```js
var haraldutil = require('haraldutil')
console.log('Any value works:', haraldutil.shallowClone(undefined))
var o = {a: 'unchanged'}
var o1 = haraldutil.shallowClone(o)
o1.a = 'changed'
console.log('o:', o)
```
```
Any value works: {}
o: { a: 'unchanged' }
```
### browseTo(url)
Opens the system default browser, or a new tab in the active browser window, displaying the location url.
```js
require('haraldutil').browseTo('http://google.com').on('exit', function (code) {
	if (code) console.log('Failed with exit code:' + code)
})
```

### getType(path1)
Determine what path1 is, an improved to fs.exists function.
```js
var haraldutil = require('haraldutil')
console.log('Type:', haraldutil.getType('/home'))
```
```
Type: 1
```
return value:

* undefined: path1 does not exist
* 1: path1 is a directory
* true: path1 is a file

### getHomeFolder()
Get the path to the user's home folder
```js
var haraldutil = require('haraldutil')
console.log('Home folder:', haraldutil.getHomeFolder())
```
```
Home folder: /home/foxyboy
```

### getHomeFolder()
Get path to a folder for temporary files
```js
var haraldutil = require('haraldutil')
console.log('Tmp folder:', haraldutil.getTmpFolder())
```
Tmp folder: /home/foxyboy/tmp
```
if the user's home folder has a tmp, this is used. Otherwise, the systems temporary files folder is provided.

### parseTrace(e)

If e is an Error object that has a stack trace, the parsed stack trace is returned as an object. Otherwise undefined is returned.
```js
var haraldutil = require('haraldutil')
var s = haraldutil.parseTrace(new Error)
if (s) console.log(s.frames[0])
```
```
{ text: 'parseTrace (/home/foxyboy/Desktop/c505/node/haraldutil/test/examples/examples.js:40:31)',
  folder: '/home/foxyboy/Desktop/c505/node/haraldutil/test/examples',
  file: 'examples.js',
  line: 40,
  column: 31,
  func: 'parseTrace' }
```
return value: object or undefined
* .message: string: the leading error message
* .frames: array of object: captured stack traces

Each frame in the frames array
* .func: optional string: Object.function expression in the code
* .as: optional string: function name if different from property name
* .folder: optional string: if a folder other than current directory, then the absolute path to folder where source file is located, '/home/user'
* .file: optional string: source file name, 'script.js'
* .line: optional number: 10
* .column optional number: 5
* .source: optional string: text that may appear instead of file and folder, eg. 'unknown source'
* .text: string: this frame as text. contains no newlines and has the leading at removed

### eToString(err, trace)
make an Error object printable
```js
var haraldutil = require('haraldutil')
try {
	JSON.parse('que')
} catch (e) {
	console.log(haraldutil.eToString(e))
}
```
Note the type property that JSON.parse adds to the Error object:
```
SyntaxError: Unexpected token q
    at Object.parse (native)
    at eToString (/home/foxyboy/Desktop/c505/node/haraldutil/test/examples/examples.js:52:7)
    at demonstrate (/home/foxyboy/Desktop/c505/node/haraldutil/test/examples/examples.js:70:2)
    at /home/foxyboy/Desktop/c505/node/haraldutil/test/examples/examples.js:61:2
    at Array.forEach (native)
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/haraldutil/test/examples/examples.js:60:7)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
type: 'unexpected_token'
```
* e: Error object
* trace: optional boolean: false: do not include the stack trace
* return value: printable string

### getLocation(opts)
Gets the current script executing location as a string.
```js
var haraldutil = require('haraldutil')
console.log(haraldutil.getLocation())
```
```
function: demonstrate file: examples.js:61:2 folder: /home/foxyboy/Desktop/c505/node/haraldutil/test/examples
```
* opts: optional object
* .offset: offset in the stack for lcoation
* .err: optional Error object
* .object: optional boolean: false: do not prepend object and * method, eg. Module.load
* .folder: optional boolean: false: do not include file folder
* .fileline: true: no column, no fileheader
* .dropExt: remove extention from filename
* .addAfterFile: string

return value: printable string
* empty string on troubles

### getLoc(s)
Gets location as file:line
```js
// example.js
var haraldutil = require('haraldutil')
funcName()
function funcName() {
  // next line is line 6
  console.log(haraldutil.getLoc(arguments.callee.name), 'Hello')
}
```
```
example:6:funcName Hello
```
* s: optional string

### toNumber(str, allowFloat)
parse numbers, NaN if trailing non-numeric characters

* str: string: format: [+-]0-9..[.0-9..]
* allowFloat: optional boolean: allow decimal part, default no
* leading and trailing whitespace and line terminators are allowed
* unparseable numbers return NaN

This function is similar to parseFloat, but does not accept trailing garbage characters.

### getTimestamp(date)
convert Date to a unix timestamp number.

* date: optional Date, default now

### getDate(timestamp)
convert a unix timestamp number to Date.

* timestamp: number: Unix epoch
* return value: Date object

### getDateString(timestamp, timezoneMinutesOffUtc, modifier)
Convert unix timestamp to string like '2011-09-30T23:21-0400'

* timestamp: optional number: unix timestamp, default: now
* timezoneMinutesOffUtc: optional number: minutes off utc, negative west of London, -240 for NY
* modifier: optional number: 1: skip date part, 2: skip date and timezone

### getTimevalString(...)
Same as getDateString but for a JavaScript timeval

### getISOPacific(date, offset)
Print an ISO8601 string adjusted for US daylight savings
```
var haraldutil = require('haraldutil')
console.log(haraldutil.getISOPacific())
```
```
2012-07-01T02:00-08
```

* date a Date object, default now
* offset number, minutes from utc, default -420 (Pacific standard time)

Note that JavaScript does not provide daylight savings data for timezones, but it is implemented here of the US.

### encodeTimeNumber(hour, minute, tzOffset)
Encoding that allows for difference and comparison within a day for any time zone

This allows to compare what is earlier in the day for another timezone than localtime or utc, using the commonly available utc timevalues.

* hour, minute: number: base time 0-23, 0-59
* tzOffset: offset from base location in minutes for result
* if base is in utc timezone and tzOffset is -240, result will be in eastern daylight time

### CreateKey(s1, s2, ...)
Construct a unique string value based on the function arguments.
```js
var haraldutil = require('haraldutil')
var dbServer = 'server'
var dbTable = 'table'
var dbTable2 = 'table2'
var key1 = haraldutil.createKey(dbServer, dbTable)
var key2 = haraldutil.createKey(dbServer, dbTable2)
if (key1 !== key2) console.log('not the same')
```
```
not the same
```

* If any argument is not a non-empty string, exception is thrown
* For keys to match, every string argument at their creation must have been exactly the same

### periodString(num)
provide a human-readable string expressing a time period to two-digit precision
```js
var haraldutil = require('haraldutil')
console.log('The world will come to an end in:', haraldutil.periodString(1e7))
```
```
The world will come to an end in: 2 h 46 min
```

* num: timevalue, unit: ms, positive value

# Notes

(c) [Harald Rudell](http://www.haraldrudell.com) wrote this for node in October, 2011

No warranty expressed or implied. Use at your own risk.

Please suggest better ways, new features, and possible difficulties on [github](https://github.com/haraldrudell/haraldutil)