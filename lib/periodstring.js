// periodstring.js
// Describe a time period with 2-digit accuracy
// © 2012 Harald Rudell <harald@therudells.com> MIT License

exports.periodString = periodString

var time1s = 1e3
var time1minute = 60 * time1s
var time1hour = 60 * time1minute
var time1day = time1hour * 24
var time10days = time1day * 10
var time1year = 365 * time1day
var time10years = 10 * time1year

/*
provide a human-readable string displaying a time period
rounding down

num: JavaScript time value (positive, unit ms)
return value: printable string
*/
function periodString(num) {
	var result = []

	num = Number(num)
	if (!isNaN(num) && num >= 0) {
		if (num < time1minute) result.push((Math.floor(num) / time1s).toFixed(3), 's')
		else if (num < time1hour) result.push(Math.floor(num / time1minute), 'min', Math.floor((num / time1s) % 60), 's')
		else if (num < time1day) result.push(Math.floor(num / time1hour), 'h', Math.floor((num / time1minute) % 60), 'min')
		else if (num < time10days) result.push(Math.floor(num / time1day), 'd', Math.floor((num / time1hour) % 24), 'h')
		else if (num < time1year) result.push(Math.floor(num / time1day), 'd')
		else if (num < time10years) result.push((Math.floor(10 * num / time1year) / 10), 'y')
		else result.push(Math.floor(num / time1year), 'y')
	}

	if (result.length) result = result.join(' ')
	else result = '?'

	return result
}