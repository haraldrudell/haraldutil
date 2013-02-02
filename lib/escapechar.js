// escapechar.js
// convert unprintable characters to printable character sequences
// © 2011 Harald Rudell <harald@therudells.com> MIT License

exports.escapedChar = escapedChar

/*
the sensitive character codes
printable: space 32 - tilde 126, excluding single quote
*/
var minPrinted = ' '.charCodeAt(0)
var maxPrinted = '~'.charCodeAt(0)
var quoteCode = '\''.charCodeAt(0)

/*
JavaScript string literals single escape characters
key: unprintable character
value: escaped printable sequence
*/
var characterEscapeSequences = {
	'\r': '\\r',
	'\'': '\\\'',
	'\b': '\\b',
	'\\': '\\\\',
	'\f': '\\f',
	'\n': '\\n',
	'\t': '\\t',
	'\v': '\\v',
}

/*
escape a single character
ch: single character string
return value: printable string representing ch
*/
function escapedChar(ch) {

	// get the unicode character code number
	var code = ch.charCodeAt(0)
	if (code < minPrinted || code > maxPrinted || code == quoteCode) {
		// the character needs escaping

		// single-character escapes
		var escape = characterEscapeSequences[ch]
		if (escape) ch = escape
		else {

			// construct a unicode escape sequence \u1234
			escape = code.toString(16)
			ch = '\\u' + (escape.length < 4 ?
				'0000'.slice(-4 + escape.length) + escape :
				escape)
		}
	}
	return ch
}