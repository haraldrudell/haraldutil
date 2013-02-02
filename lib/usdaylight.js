// usdaylight.js
// Determine if the United States is currently using daylight savings time
// © 2012 Harald Rudell <harald@therudells.com> MIT License

var march = 2
var november = 10
var twoAmEt = 6

exports.isUsDaylightSavings = isUsDaylightSavings

/*
Determine if the us is using daylight savings time
dateUtc: Date

calculation for eastern timezone

return value: boolean
*/
function isUsDaylightSavings(dateUtc) {

	/*
	calculate in the utc time zone
	2am est = 6am utc
	*/

	/*
	Daylight time savings starts at 2 am est
	The second Sunday in March
	March 1, 2 am
	*/
	var year = dateUtc.getUTCFullYear()
	var dateDstBegin = new Date(Date.UTC(year, march, 1, twoAmEt))
	var weekday = dateDstBegin.getUTCDay()
	var days = !weekday ? 7 : 14 - weekday // number of days to get to second Sunday
	dateDstBegin = new Date(Date.UTC(year, march, 1 + days, twoAmEt))

	// Daylight time savings ends at 2 am first Sunday in November est
	var dateDstEnd = new Date(Date.UTC(year, november, 1, twoAmEt))
	weekday = dateDstEnd.getUTCDay()
	if (weekday) dateDstEnd = new Date(Date.UTC(year, november, 1 + 7 - weekday, twoAmEt))

	return dateUtc >= dateDstBegin && dateUtc < dateDstEnd
}
