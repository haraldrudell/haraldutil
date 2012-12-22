// usdaylight.js
// determine if United States is currently using daylight savings time

/*
determine if the dateUtc is within daylight savings time
dateUtc: Date, eg. (new Date)
return value: boolean true if daylight savings is used
*/
module.exports = function(dateUtc) {

	// calculate in the utc time zone
	// 2am est = 6am utc

	// Daylight time savings starts at 2 am est
	// The second Sunday in March
	// March 1, 2 am
	var year = dateUtc.getUTCFullYear()
	var march = 2
	var november = 10
	var dateDstBegin = new Date(Date.UTC(year, march, 1, 6))
	var weekday = dateDstBegin.getUTCDay()
	// number of days to get to second Sunday
	var days = weekday == 0 ? 7 : 14 - weekday
	dateDstBegin = new Date(Date.UTC(year, march, 1 + days, 6))

	// Daylight time savings ends at 2 am first Sunday in November est
	var dateDstEnd = new Date(Date.UTC(year, november, 1, 6))
	weekday = dateDstEnd.getUTCDay()
	if (days != 0) {
		dateDstEnd = new Date(Date.UTC(year, november, 1 + 7 - weekday, 6))
	}

	return dateUtc >= dateDstBegin && dateUtc < dateDstEnd
}