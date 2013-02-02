// timestamp.js
// Functions supporting unix timestamp and text output in any timezone
// © 2013 Harald Rudell <harald@therudells.com> MIT License

var timeutil = require('./timeutil')

;[
getTimestamp, getDate, getDateString,
].forEach(function (f) {exports[f.name] = f})

/*
Convert Date to a unix timestamp number
date: optional Date, default now

return value: number: Unix epoch
*/
function getTimestamp(date) {
	return Math.floor((date ? date.getTime() : Date.now()) / 1e3)
}

/*
Convert a unix timestamp number to Date
timestamp: number: Unix epoch

return value: Date object
*/
function getDate(timestamp) {
	return new Date(timestamp * 1000)
}

/*
Get a  time string from a Unix timestamp
timestamp: optional number, default now: Unix epoch
timezoneMinutesOffUtc
modifier: optional number

return value: printable string
*/
function getDateString(timestamp, timezoneMinutesOffUtc, modifier) {
	return timeutil.getTimevalString(timestamp != null ? timestamp * 1e3 : null, timezoneMinutesOffUtc, modifier)
}
