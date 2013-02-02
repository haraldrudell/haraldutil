// timenumber.js
// Encoding for time-of-day compairsons for any time zone
// © 2012 Harald Rudell <harald@therudells.com> MIT License

exports.encodeTimeNumber = encodeTimeNumber

/*
Encoding facilitating difference and comparison in any time zone
hour: number 0-23
minute: number: 0-59
tzOffset: offset from base location in minutes

if base is utc and tzOffset is -240, comparison pertains to eastern winter time

return value: value allowing for time-of-day compairsons
*/
function encodeTimeNumber(hour, minute, tzOffset) {
	// calculate time in zulu
	var result = (hour * 60 + minute) + (tzOffset || 0)
	// 1440 corresponds to 24 hours
	if (result < 0 || result >= 1440) result = ((result % 1440) + 1440) % 1440
	return result
}
