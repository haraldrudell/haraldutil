// timeutil.js
// functions supporting unix timestamp and text output in any timezone
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var usdaylight = require('./usdaylight')

;[
getTimevalString, getISOPacific,
].forEach(function (f) {exports[f.name] = f})

/*
Convert timeval to string:
timestamp: optional number: timeval, default: now
timezoneMinutesOffUtc: optional number: minutes off utc, negative west of London, -240 for NY
modifier: optional number:
default: '2011-09-30T23:21-0400'
1: skip date part:
2: skip date and timezone
3:

return value: printable string
*/
function getTimevalString(timeval, timezoneMinutesOffUtc, modifier) {

	if (timeval == null) timeval = Date.now()
	if (timezoneMinutesOffUtc == null) timezoneMinutesOffUtc = -new Date().getTimezoneOffset()

	/*
	date and time part
	eg ET when 0:00 in London, 20:00 the day before in NY
	toISOString: 2011-09-30T23:21:01.721Z
	*/
	var result = new Date(timeval + timezoneMinutesOffUtc * 6e4)
		.toISOString().substring(
			modifier > 0 ? 11 : 0,
			modifier != 3 ? 16 : 19)

	// timezone suffix: Z, -04, +0630
	if (modifier !== 2) {
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

/*
Zero-pad a number to two-digits length
number: positive integer less than 100
return value: string: length 2, padded with leading zeroes
*/
function getTwoDigits(number) {
	return ('00' + number).slice(-2)
}

var PST = -8 * 60
function getISOPacific(date, timezoneMinutesOffUtc) {
	if (!date) date = new Date
	if (!timezoneMinutesOffUtc) timezoneMinutesOffUtc = PST
	var isDaylightSavings = usdaylight.isUsDaylightSavings(date)
	if (isDaylightSavings) timezoneMinutesOffUtc += 60
	return getTimevalString(date.getTime(), timezoneMinutesOffUtc)
}
