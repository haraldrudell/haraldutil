# haraldutil
Utility functions for time, errors, numbers and more.

## Benefits

1. Convert any object or value to a printable string extacly defining types and values
2. Handle object function arguments with helper functions
3. Easily parse, filter and print error results, stack traces and code locations
4. Read numbers in a strict way
5. Handle, convert and compare time formats and timezones

## Features

1. Flexible and recursive conversion of any value to a string representation
2. Object manipulation methods
3. Portable path, number and browser functions
4. Error and stack trace parsers and string conversions
5. JavaScript time value, Unix timestamp and timezone functions

# Reference

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

### getCbCounter()
Ensures that all callbacks has completed

```js
var haraldutil = require('haraldutil')
var cbc = haraldutil.getCbCounter()
setTimeout(cbc.add(callback), 100)
setTimeout(cbc.add(callback), 100)

function callback() {
  if (cbc.isDone(arguments.callee))
    console.log('All callbacks completed.')
  else console.log('Not done yet...')
}
```
```
Not done yet...
All callbacks completed.
```
var cbc = getCbCounter(opts)
* opts: optional object
* opts.emitter: optional event emitter or boolean. default: errors are thrown

  * false: errors are ignored
  * emitter: errors are emitted

* opts.callback: function or array of function: add is done for each function

cbc: object
* .add(f): adds a callback for function f, return value: f
* .isDone(f): notes one callback completed. returns true if all callbacks complete, otherwise false
* .getStatus(): gets an object representing the current state

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

return value: printable string
* empty string on troubles

### getJsonStore(opts, cb)
Facilitates easy save of objects in the filesystem.

```js
var haraldutil = require('haraldutil')
var store = haraldutil.getJsonStore({name: 'json'})
store[store.getNextId()] = {key: 'value'}
store.save()
```

opts: object
* .name: string filename

  * default name is 'temp'
  * default extension is .json
  * default folder is a suitable temp folder

* emitter: optional error emitter, default: errors are thrown

  * false: errors are ignored
cb: optional callback

return value: store object
* .save(cb(err)): save to disk
* .getNextId(): gets a new serial number

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

### encodeTimeNumber(hour, minute, tzOffset)
Encoding that allows for difference and comparison within a day for any time zone

* hour, minute: number: base time 0-23, 0-59
* tzOffset: offset from base location in minutes for result
* if base is in utc timezone and tzOffset is -240, result will be in eastern time

# Notes

(c) [Harald Rudell](http://www.haraldrudell.com) wrote this for node in October, 2011

No warranty expressed or implied. Use at your own risk.

Please suggest better ways, new features, and possible difficulties on [github](https://github.com/haraldrudell/haraldutil)