var haraldutil = require('../util.js')
timeutil = haraldutil.timestamp

timestamp = 1317660120
console.log('getDateString:',
  timeutil.getDateString(timestamp, -240),
  timeutil.getDateString(timestamp, 0),
  timeutil.getDateString(timestamp, -420, true))
console.log('expected:      2011-10-03T12:42-04 2011-10-03T16:42Z 09:42-07')

