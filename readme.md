# haraldutil
Utility functions for time, errors, numbers and more.

# Reference

### inspect(v, optsArg)
return value: printable string

Any value os formatted for exactly identifying type and value and will not contain unprontable characters

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

### inspectDeep(v)
Provides prototype chains, and unlimited strings. Abbreviates array-type properties at 10elements.

### merge(o1, o2, ...)
Create an object constructed using the enumerable properties of all provided arguments.

* same name properties from later objects overwrite
* return value: Object object with only enumerable properties

### browseTo(url)
Opens the system default browser, or a new tab in the active browser window displaying the location url.

### getType(path1)
Determine what path1 is.

return value:

* undefined: path1 does not exist
* false: path1 is a directory
* true: path1 is a file

### logException(e, heading, printmethod, offset)
Log detauils about an exception.

* heading: optional heading string, eg. 'reading file'
* printmethod: method to use for output, default: console.log
* Offset possible call stack offset, default callers location

### checkSuccess(error, heading, printmethod, offset)
Checks for success outcome in a callback

* error: callback error argument
* heading: optional heading string, eg. 'reading file'
* printmethod: method to use for output, default: console.log
* offset possible call stack offset, default callers location
* return value: true if there was no error

### logError(e, heading, printmethod, offset)
Outputs an error to the log.

* e: error value, such as an Error object or catch argument
* heading: optional heading string, eg. 'reading file'
* printmethod: mnethod to use for output, default: console.log
* offset possible call stack offset, default callers location

### getLocation(includeObject, offset)
Gets the current script executing location as a string.

* includeObject: prepend object and method, eg. Module.load
* offset: caller offset in the stack
* return value: printable string eg. 'file:tracker.js:5:15 function:Object.<anonymous> folder:/home/folder'

### eToString(err)
Converts an Error object to string including

* Error type and message
* Stack trace
* Any hidden or enumerable properties

Values other than Error objects are converted to string

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