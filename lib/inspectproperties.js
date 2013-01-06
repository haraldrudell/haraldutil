// inspectproperties.js
// make anything a unique printable value
// © Harald Rudell 2012

exports.printProperties = printProperties

// when printing prototype objects, this property is not printed
var suppressedPrototypeFields = ['constructor']
// when printing funcion objects, these properties are not printed
var suppressedFunctionFields = ['name', 'prototype', 'constructor', 'length', 'caller', 'arguments']

/*
print possible properties

p object controling printing of properties
.result: array of string: result so far
.printBracesMaybe: boolean: output braces if there are properties to print
.printPropertiesMaybe: boolean: print properties other than array keys
.printBrackets: boolean: print brackets rather than braces
.g.objects: [] for detecting cyclic references
.g.levelCount: limiting property levels printed
.g.opts
*/
function printProperties(p) {
	var propertyCount = 0
	var isAbbreviating
	var propObj
	var protoArray = []
	var printed = 0
	var didPrint
	p.g.objects.push(p.v)

	// opening brace or bracket
	var firstLeadIn // what precedes first property, fior array nothing
	var leadIn = ', ' // what precedes a subequent property, for array comma-space
	var endOut = ']' // how to end, for array closing brace
	var indent // indent at this level, does not apply to single-line arrays
	if (p.printBrackets) p.result.push('[')
	else { // this is object-style: multi-line, indentation and curly braces
		var endOut = '}'
		if (p.g.opts.singleLine) {
			indent = ''
			propIndent = ''
			leadIn = ', '
		} else {
			indent = [ '\n' ]
			for (var i = 0; i < p.g.levelCount; i++) indent.push('  ')
			indent = indent.join('')
			var propIndent = indent + '  ' // properties are indented one extra level
			leadIn = ',' + propIndent
		}
		if (!p.printBracesMaybe) { // always braces, print them now
			if (p.result.length) p.result.push(' ')
			p.result.push('{')
			firstLeadIn = propIndent
		} else firstLeadIn = ' {' + propIndent // maybe braces, add the possible opening brace
	}

	if (p.g.opts.maxLevels == null || p.g.levelCount < p.g.opts.maxLevels) for (;;) {

		// get the next list of properties
		var propertyList
		// simple list: all properties of the object at once
		if (!p.g.opts.nonEnum) propertyList = Object.keys(propObj = p.v)
		else {
			// properties by prototype
			if (!propObj) propObj = p.v
			else {
				// find the next prototype
				var propObj = propObj.__proto__

				if (propObj.constructor.name == 'SlowBuffer' ||
					propObj.constructor.name == 'Buffer') propObj = null

				// abbreviated prototypes
				if (propObj == Object.prototype || // prototype Object: saves 11 lines for all objects
					propObj == Function.prototype || // saves 10 lines for all function objects
					propObj == Array.prototype || // saves 40 array function names from printing
					propObj == Date.prototype || // saves 48 function names from printing
					propObj == RegExp.prototype //|| // saves 16 lines for all RegExp objects
					//propObj == Error.prototype // only 3 lines, print this
					) {
					//p.result.push(leadIn, '-- known prototype:', propObj.constructor.name)
					propObj = null
				}

				if (!propObj) break // prototype chain ended
				protoArray.push(propObj.constructor && propObj.constructor.name || '')
			}
			propertyList = getProperties(propObj, protoArray.length != 0)

		}

		// iterate over all properties
//if (!Array.isArray(propertyList)) {
//console.log('propertyList:', typeof propertyList, propertyList)
//}
		propertyList.every(printProperty)
		if (!p.g.opts.nonEnum) break
	} else { // at max depth
//console.log('maxx')
		p.result.push('...')
	}

	// closing bracket or brace
	if (p.printBrackets) p.result.push(endOut)
	else if (!p.printBracesMaybe || didPrint) {
		if (printed) p.result.push(indent)
		p.result.push(endOut)
	}

	return p.result

	function printProperty(propertyName, index, names) {

		// deal with array-style properties
		if (printed++ == propertyName) { // this is an array -style property

			// primitive string: avoid printing the string also as an arrray
			if (p.printPropertiesMaybe) return true

			// abbreviate array-style properties
			if (isAbbreviating) { // we are in the abbreviated section
				// if there is yet another array-style property, keep abbreviating
				if (names[index + 1] == index + 1) return true
				// this is the last array-style, start printing again
				isAbbreviating = false
			} else if (p.g.opts.maxProperties != 0 && // we are limiting array-style properties
				propertyCount == p.g.opts.maxProperties && // this is where we should abbreviate
				names[index + 1] == index + 1 && // there is a next property
				names[index + 2] == index + 2) { // there is a next-next property
				isAbbreviating = true // we are now abbreviating propertues
				p.result.push(leadIn, '...')
				return true
			} else propertyCount++
		}

		didPrint = true

		// lead-in for property name
		if (printed == 1) {
			if (firstLeadIn) p.result.push(firstLeadIn)
		} else p.result.push(leadIn)

		// prototype labels
		if (protoArray.length) { // we are printing prototypes
			protoArray.forEach(function (prototypeName) {
				if (prototypeName) p.result.push('-- prototype: ', prototypeName)
				else p.result.push('-- prototype')
				p.result.push(leadIn)
			})
			protoArray = []
		}

		// property name
		// suppressed for array's linear index 0..
		var getter
		if (!p.printBrackets || (printed - 1) != propertyName) {

			if (p.g.opts.nonEnum) {
//console.log('getdesc:', propObj, propertyName)
				// check for detailed property data
				var propertyDescriptor = Object.getOwnPropertyDescriptor(propObj, propertyName)
				// some properties do not provide a descriptor
				if (typeof propertyDescriptor == 'object') {
					if (propertyDescriptor.enumerable === false) p.result.push('(nonE)')
					if (propertyDescriptor.get) {
						getter = propertyDescriptor.get
						p.result.push('(get)')
					}
				}
			}
			p.result.push(propertyName, ': ')
		}

		// value
		// getters may throw exception
		var value
		var exception
		try {
			value = propObj[propertyName]
		} catch (e) {
			// if the getter throws an exception, we do not output a value
			exception = true
			p.result.push('[getter Exception:', e instanceof Error ? e.toString() : 'Exception:' + String(e), ']')
		}
		if (!exception) {
			if (propObj instanceof Error &&
				propertyName == 'stack' &&
				typeof value == 'string') {
				var lines = value.split('\n')
				lines.forEach(function (line, index) {
					if (index) p.result.push(leadIn)
					p.result.push(line)
				})
			} else {
				var recursive = p.g.objects.indexOf(value) + 1
				if (!recursive) {
					p.g.levelCount++
					p.result.push(p.getPrintableValue(value))
					p.g.levelCount--
				} else p.result.push('recursive-object#', recursive)
			}
		}

		return true
	}

	/*
	get the properties of object
	doSuppress: boolean: remove properties that are to be suppressed
	return value: array of string: properties
	enumerable properties first, followed by non-enumerable
	*/
	function getProperties(object, doSuppress) {
		var props = []
		var nonEnumProps = []
		var suppress
		if (typeof object == 'function') suppress = suppressedFunctionFields
		else if (doSuppress) suppress = suppressedPrototypeFields

		Object.getOwnPropertyNames(object).forEach(function (prop) {

			// suppress
			if (!suppress || suppress.indexOf(prop) == -1) {

				// some objects throw exception
				var isEnum
				try {
					isEnum = p.v.propertyIsEnumerable(prop)
				} catch (e) {
					// if there is an exception, assume the property is not enumerable
					isEnum = false
				}
				if (isEnum) props.push(prop)
				else nonEnumProps.push(prop)
			}
		})

		// append nonEnumProps
		props.push.apply(props, nonEnumProps)

		return props
	}
}