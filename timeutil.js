//
// time and Date functions
//

module.exports.getTimestamp = getTimestamp
module.exports.getDate = getDate
module.exports.getDateString = getDateString

// convert Date to a unix timestamp number
function getTimestamp(date) {
  return Math.round(date.getTime() / 1000)
}

// convert a unix timestamp number to Date
function getDate(timestamp) {
  return new Date(timestamp * 1000)
}

// convert unix timestamp to given time zone in format 2011-09-30T23:21-0400
// timestamp: unix timestamp
// timezoneMinutesOffUtc: negative west of London, -240 for NY
// modifier: 1: skip date part, 2: skip date and timezone
function getDateString(timestamp, timezoneMinutesOffUtc, modifier) {
  
  if (timezoneMinutesOffUtc == null) {
    timezoneMinutesOffUtc = Date.getTimezoneOffset()
  }

  // date and time part
  // eg ET when 0:00 in London, 20:00 the day before in NY
  // toISOString: 2011-09-30T23:21:01.721Z
  var startIndex = modifier > 0 ? 11 : 0
  var result = getDate(timestamp + (timezoneMinutesOffUtc || 0) * 60)
    .toISOString().substring(startIndex, 16)

  // timezone suffix: Z, -04, +0630
  if (modifier != 2) {
    if (timezoneMinutesOffUtc) {
      var absoluteValue = Math.abs(timezoneMinutesOffUtc)
      result += (timezoneMinutesOffUtc < 0 ? '-' : '+') + getTwoDigits(absoluteValue / 60)
      var minutes = absoluteValue % 60
      if (minutes) result += getTwoDigits(minutes)
    } else {
      result += 'Z'
    }
  }
  
  return result
}

// number: positive integer less than 100
// result: two-digit string '00' .. '99'
function getTwoDigits(number) {
  var result = number.toString()
  if (result.length < 2) {
      result = '0' + result
  }
  return result
}
