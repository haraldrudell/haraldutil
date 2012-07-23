# haraldutil
Printing functions and handling of Unix timestamp

# Reference

### logException(e, heading, printmethod, offset)
// log exception e caught in a catch construct
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location

### checkSuccess(error, heading, printmethod, offset)
// check success in a callback
// error: callback error argument
// heading: optional heading string, eg. 'reading file'
// printmethod: method to use for output, default: console.log
// offset possible call stack offset, default callers location
// return value: true if there was no error

### logError(e, heading, printmethod, offset)
// log an error
// e: error value, such as an Error object or catch argument
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location

### getLocation(includeObject, offset)
// get the current script executing location
// includeObject: prepend object and method, eg. Module.load
// offset: caller offset in the stack
// return value: printable string eg. 'tracker.js:5:15-Object.<anonymous>'

### toNumber(str, allowFloat)
// parse numbers, NaN if trailing non-numeric characters
// str: string: format: [+-]0-9..[.0-9..]
// allowFloat: optional boolean: allow decimal part, default no
// leading and trailing whitespace and line terminators are allowed
// bad numbers return NaN

### getTimestamp(date)
// convert Date to a unix timestamp number
// date: optional Date, default now

### getDateString(timestamp, timezoneMinutesOffUtc, modifier)
// convert unix timestamp to string
// '2011-09-30T23:21-0400'
// timestamp: optional number: unix timestamp, default: now
// timezoneMinutesOffUtc: optional number: minutes off utc, negative west of London, -240 for NY
// modifier: optional number: 1: skip date part, 2: skip date and timezone

### encodeTimeNumber(hour, minute, tzOffset)
// encoding that allows for difference and comparison in any time zone
// hour, minute: number: base time 0-23, 0-59
// tzOffset: offset from base location in minutes for result
// if base is in utc timezone and tzOffset is -240, result will be in eastern time

### inspectAll(v)
provide unique all-encompassing string describing v value and type

### inspect(v, optsArg)
// return value: printable string
// opts: object
// .maxString: optional number, default 40, max character of string to print
// .maxProperties: optional number,default 10: max properties ot print
// .maxLevels: optional numvber, default 2: max levels of objects and arrays to print
// .nonEnum: optional boolean, default false: printing of non-enumerable object properties