var haraldutil = require('../util.js')
timeUtil = haraldutil.timeUtil

timestamp = 1317660120
console.log('getDateString:',
  timeUtil.getDateString(timestamp, -240),
  timeUtil.getDateString(timestamp, 0),
  timeUtil.getDateString(timestamp, -420, true))
console.log('expected:      2011-10-03T12:42-04 2011-10-03T16:42Z 09:42-07')

