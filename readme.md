<h1>haraldutil</h1>
<p>Utility functions for handling data types, errors, and unknown JavaScript values.</p>

<h2>Benefits</h2>
<ol>
<li><strong>Save time and code</strong> by using well tested, commonly sought functions</li>
<li><strong>Immediately</strong> find printout statements by having file and function names available</li>
<li>Examine <strong>exact type</strong> of values with hidden properties and full prototype chains</li>
<li><strong>Separate logging</strong> by multiple instances by preceding with process id or host name</li>
<li>Enhanced <strong>app portability</strong> across Linux, Mac and Windows</li>
</ol>
<p>&copy; 2011, 2013 <a href=http://www.haraldrudell.com><strong>Harald Rudell</strong></a> wrote haraldutil for node in October, 2011</p>

<h2>Features</h2>
<ol>
<li>Conversion of any value to printable string representation</li>
<li>Object manipulation methods</li>
<li>Portable path, number and browser-launch functions</li>
<li>Error and stack trace parsers and string conversions</li>
<li>JavaScript time value, Unix timestamp and timezone functions</li>
</ol>

<h1>Reference</h1>
<h2>p(...), ps()</h2>
<p>Console.log equivalent with added leading code location
```js
var p = require('haraldutil').p

p('Printouts start with code location: file:line:function')
p('In an anonymous function, the function name is omitted')
someFunction()

function someFunction() {
  p('Value examples:', undefined, '1',
    new function Class() {this.a = 1},
    JSON.stringify, new Error('a'))
}
```
```
examples:15 Printouts start with code location: file:line:function
examples:16 In an anonymous function like here, the function name is omitted
examples:20:someFunction Leading string does format [object Object] NaN {"a":1}
examples:21:someFunction undefined '1' { a: 1 } [Function: stringify] [Error: a]
```
</p>
<ul>
<li>return value: the string</li>
<li>ps is like p, but omits the console.log</li>
</ul>
<p>
```js
console.log('ps is p without logging, it can output location:', ps())
```
```
ps is p without logging, it can output location: examples:28
```
</p>


<h2>pargs(arguments)</h2>
Prints haraldutil.inspect of the argument list for a function
```js
var haraldutil = require('haraldutil')
var pargs = haraldutil.pargs

someFunction(undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))

function someFunction() {
  pargs(arguments)
}
```
```
examples:38:someFunction undefined, '1', object:Class {a: 1}, function stringify(), Error: a
```


<h2>pPrepend(str)</h2>
pPrepend adds a lead-in to functions p, ps, pargs, q, qs, pp and pps
```js
var haraldutil = require('haraldutil')
var p = haraldutil.p
var pPrepend = haraldutil.pPrepend

pPrepend(process.pid)
p('Launching of new process')

pPrepend(require('os').hostname() + ':' + process.pid)
p('Launching on new host')
```
```
19854:examples:51 'Launching of new process'
somehostname:19854:examples:54 'Launching on new host'
```
* pPrepend(): removes the current prepend value
* pPrepend(null): gets the current prepend value



<h2>q(...), qs(...)</h2>
q and qs does a more detailed haraldutil.inspect.
```js
var q = require('haraldutil').q

someFunction()

function someFunction() {
  q('q and qs are like p and ps but does haraldutil.inspect rather then util.format')
  q(undefined, '1', new function Class() {this.a = 1}, JSON.stringify, new Error('a'))
}
```
```
examples:61:someFunction 'q and qs are like p and ps but does haraldutil.inspect rather then util.format'
examples:62:someFunction undefined '1' object:Class {a: 1} function stringify() Error: a
```

<h2>pp(...), pps(...)</h2>
Printout with code location and exhaustive inspect of values.
```js
var pp = require('haraldutil').pp

someFunction()

function someFunction() {
  pp(console)
}
```
```
examples:17:someFunction {
  info: function (),
  log: recursive-object#2,
  error: function (),
  time: function (label),
  warn: recursive-object#3,
  dir: function (object),
  trace: function (label),
  assert: function (expression),
  timeEnd: function (label)
}
```
* return value: the string
* pps is like pp, but omits the console.log



<h2>inspectDeep(v)</h2>
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


<h2>inspect(v, optsArg)</h2>
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


<h2>inspectAll(v)</h2>
provide unique all-encompassing string describing value and type.

<h2>clone(o1)</h2>
<p>Clone an object and its enumerable properties</p>
<ul><li>o: value of array, object and primitive properties</li></ol>

<p>Array, Date and RegExp instances are cloned.
other objects becomes Object objects, ie. Function, Error etc.
non-enumerable properties, getters and setters are not copied
</p>


<h2>merge(o1, o2, ...)</h2>
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



<h2>shallowClone(object)</h2>
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



<h2>browseTo(url)</h2>
Opens the system default browser, or a new tab in the active browser window, displaying the location url.
```js
require('haraldutil').browseTo('http://google.com').on('exit', function (code) {
	if (code) console.log('Failed with exit code:' + code)
})
```

<h2>getType(path1)</h2>
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


<h2>getHomeFolder()</h2>
Get the path to the user's home folder
```js
var haraldutil = require('haraldutil')
console.log('Home folder:', haraldutil.getHomeFolder())
```
```
Home folder: /home/foxyboy
```


<h2>getTmpFolder()</h2>
Get path to a folder for temporary files
```js
var haraldutil = require('haraldutil')
console.log('Tmp folder:', haraldutil.getTmpFolder())
```
```
Tmp folder: /home/foxyboy/tmp
```
if the user's home folder has a tmp, this is used. Otherwise, the systems temporary files folder is provided.


<h2>parseTrace(e)</h2>
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

<h2>eToString(err, trace)</h2>
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



<h2>getLocation(opts)</h2>
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



<h2>getLoc(s)</h2>
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



<h2>toNumber(str, allowFloat)</h2>
parse numbers, NaN if trailing non-numeric characters

* str: string: format: [+-]0-9..[.0-9..]
* allowFloat: optional boolean: allow decimal part, default no
* leading and trailing whitespace and line terminators are allowed
* unparseable numbers return NaN

This function is similar to parseFloat, but does not accept trailing garbage characters.

<h2>getTimestamp(date)</h2>
convert Date to a unix timestamp number.

* date: optional Date, default now

<h2>getDate(timestamp)</h2>
convert a unix timestamp number to Date.

* timestamp: number: Unix epoch
* return value: Date object

<h2>getDateString(timestamp, timezoneMinutesOffUtc, modifier)</h2>
Convert unix timestamp to string like '2011-09-30T23:21-0400'

* timestamp: optional number: unix timestamp, default: now
* timezoneMinutesOffUtc: optional number: minutes off utc, negative west of London, -240 for NY
* modifier: optional number: 1: skip date part, 2: skip date and timezone

<h2>getTimevalString(...)</h2>
Same as getDateString but for a JavaScript timeval

<h2>getISOPacific(date, offset)</h2>
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

<h2>encodeTimeNumber(hour, minute, tzOffset)</h2>
Encoding that allows for difference and comparison within a day for any time zone

This allows to compare what is earlier in the day for another timezone than localtime or utc, using the commonly available utc timevalues.

* hour, minute: number: base time 0-23, 0-59
* tzOffset: offset from base location in minutes for result
* if base is in utc timezone and tzOffset is -240, result will be in eastern daylight time

<h2>createKey(s1, s2, ...)</h2>
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

<h2>periodString(num)</h2>
provide a human-readable string expressing a time period to two-digit precision
```js
var haraldutil = require('haraldutil')
console.log('The world will come to an end in:', haraldutil.periodString(1e7))
```
```
The world will come to an end in: 2 h 46 min
```

* num: timevalue, unit: ms, positive value

<h1>Notes</h1>
<p>Please suggest better ways, new features, and possible difficulties on <a href=https://github.com/haraldrudell/haraldutil>github</a></p>
<p>&copy; 2011, 2013 <a href=http://www.haraldrudell.com><strong>Harald Rudell</strong></a> wrote haraldutil for node in October, 2011</p>
