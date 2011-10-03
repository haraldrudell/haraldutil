//
// some utility functions for error handling and logging
// Harald Rudell
//
module.exports.logException = logException
module.exports.checkSuccess = checkSuccess
module.exports.logError = logError
module.exports.getLocation = getLocation
module.exports.timeUtil = require('./timeutil')

// log exception e caught in a catch construct
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location
function logException(e, heading, printmethod, offset) {
  logError(e, heading || 'Caught exception', undefined, (offset || 0) + 1)
}

// check success in a callback
// error: callback error argument
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location
// return value: true if there was no error
function checkSuccess(error, heading, printmethod, offset) {
  var success = error == null
  if (!success) {
    logError(error, heading, printmethod, (offset || 0) + 1)
  }
  return success
}

// log an error
// e: error value, such as an Error object or catch argument
// heading: optional heading string, eg. 'reading file'
// printmethod: mnethod to use for output, default: console.log
// offset possible call stack offset, default callers location
function logError(e, heading, printmethod, offset) {
  if (!heading) heading = 'Issue discovered'
  if (!printmethod) printmethod = console.log
  heading += ' at ' + getLocation(true, (offset || 0) + 1)
  // e is a JavaScript value including undefined
  if (typeof e != 'object' || !(e instanceof Error)) printmethod(heading, e)
  else {
    printmethod(heading)
    printmethod(
      'Exception:"' + e.message + '"',
      'Native error type:', e.constructor.name,
      'arguments:', e.arguments,
      'type:', e.type)
    printmethod(e.stack)
  }
}

// get the current script executing location
// includeObject: prepend object and method, eg. Module.load
// offset: caller offset in the stack
// return value: printable string eg. 'tracker.js:5:15-Object.<anonymous>'
function getLocation(includeObject, offset) {
  if (offset == null) offset = 0
  var result = ''
  var e = new Error()
  var frames = e.stack.split('\n')
  var line = frames[2 + offset]
  var file = line.lastIndexOf('/')
  var lastcolon = line.lastIndexOf(')')
  result += line.substring(file + 1, lastcolon)
  if (includeObject) {
    var at = line.indexOf('at ')
    var open = line.lastIndexOf(' (')
    result += '-' + line.substring(at + 3, open)
  }
  return result
}
