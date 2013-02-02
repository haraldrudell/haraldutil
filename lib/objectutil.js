// objectutil.js
// Helper functions for objects
// © 2012 Harald Rudell <harald@therudells.com> MIT License

exports.merge = merge
exports.shallowClone = shallowClone

/*
create an object with the enumerable properties of all provided arguments
same name properties from later objects overwrite
return value: Object object with only enumerable properties
*/
function merge() {
	var result = {}
	Array.prototype.slice.call(arguments).forEach(function (argument) {
		for (var property in argument) result[property] = argument[property]
	})
	return result
}

function shallowClone(o) {
	var result = {}
	for (var p in o) result[p] = o[p]
	return result
}