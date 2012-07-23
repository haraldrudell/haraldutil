// timeutil.js
// functions supporting unix timestamp and text output in any timezone
// written by Harald Rudell

module.exports = {
	getTimestamp: getTimestamp,
	getDate: getDate,
	getDateString: getDateString,
	encodeTimeNumber: encodeTimeNumber,
}

// convert Date to a unix timestamp number
// date: optional Date, default now
function getTimestamp(date) {
	var timevalue = date ? date.getTime() : Date/now()
	return Math.round(timevalue / 1000)
}

// convert a unix timestamp number to Date
// timestamp: number: Unix epoch
// return value: Date object
function getDate(timestamp) {
	return new Date(timestamp * 1000)
}

// convert unix timestamp to string
// '2011-09-30T23:21-0400'
// timestamp: optional number: unix timestamp, default: now
// timezoneMinutesOffUtc: optional number: minutes off utc, negative west of London, -240 for NY
// modifier: optional number: 1: skip date part, 2: skip date and timezone
function getDateString(timestamp, timezoneMinutesOffUtc, modifier) {

	if (timestamp == null) timestamp = Math.round(Date.now() / 1000)		
	if (timezoneMinutesOffUtc == null) timezoneMinutesOffUtc = -new Date().getTimezoneOffset()

	// date and time part
	// eg ET when 0:00 in London, 20:00 the day before in NY
	// toISOString: 2011-09-30T23:21:01.721Z
	var result = getDate(timestamp + timezoneMinutesOffUtc * 60)
		.toISOString().substring(
			modifier > 0 ? 11 : 0,
			modifier != 3 ? 16 : 19)

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

// encoding that allows for difference and comparison in any time zone
// hour, minute: number: base time 0-23, 0-59
// tzOffset: offset from base location in minutes for result
// if base is in utc timezone and tzOffset is -240, result will be in eastern time
function encodeTimeNumber(hour, minute, tzOffset) {
	// calculate time in zulu
	var result = (hour * 60 + minute) + (tzOffset || 0)
	// 1440 corresponds to 24 hours
	if (result < 0 || result >= 1440) result = ((result % 1440) + 1440) % 1440
	return result
}