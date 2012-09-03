// cbcounter.js

var inspect = require('./inspect')
exports.getCbCounter = getCbCounter
console.log('cbcounter', __filename)

/*
get a callback counter instance
emitter: optional error control
- event emitter: error events will be issued
- === false: errors will be ignored
- otherwise errors will be thrown

return value: object
.add(f): add one future callback invocation of function f
.isAllf(f): at function f, determine if all callbacks have completed
.getState(): get current state of counters
*/
function getCbCounter(emitter) {
console.log('getcbcounter', __filename)
	var functionList = []
	var countList = []

	return {
		add: add,
		isDone: isDone,
		getState: getState,
	}

	function add(f) {
		var index = functionList.indexOf(f)
		if (!~index) {
			countList[functionList.length] = 1
			functionList.push(f)
		} else countList[index]++

		return f
	}

	function isDone(f) {
		var result
		var index = functionList.indexOf(f)
		if (!~index) {
			reportError('isDone for unknown function: ' + inspect.inspect(f))
			result = true
		} else {
			result = --countList[index] <= 0
			if (countList[index] < 0) reportError('Too many isDone incovations: ' + (-countList[index]) + ' ' + inspect.inspect(f))
		}

		return result
	}

	function getState() {
		var result = {}
		functionList.forEach(function (f, index) {
			var fText = getFunctionDescription(f)
			var subIndex = 1
			while (result[fText]) {
				var ft = fText + ' #' + ++subIndex
				if (!result[ft]) {
					fText = ft
					break
				}
			}
			result[fText] = countList[index]
		})
		return result
	}
	function getFunctionDescription(f) {
		var result

		if (typeof f == 'function') {
			var text = f.toString()
			if (text.substring(0, 9) == 'function ') {
				var index = text.indexOf(') {')
				if (index > 10) result = text.substring(9, index + 1)
			}
			if (!result) {
				result = f.name || 'anonymous'
			}
		}
		if (!result) result = inspect.inspect(f)

		return result
	}
	function reportError(str) {
		var err = Error(str)
		if (emitter && typeof emitter.emit == 'function') emitter.emit('error', err)
		else if (emitter !== false) throw err
	}
}