module.exports = {
	/**
	 * Converts a rgba() string to hexadecimal
	 * @param string
	 * @return {*}
	 */
	rgbaToHex: function(string) {
		if(/^rgba\s*\(\s*([+-]?[0-9]+)\s*,\s*([+-]?[0-9]+)\s*,\s*([+-]?[0-9]+)\s*,\s*[+-]?([0-9]*\.)?[0-9]+\s*\)$/.test(string)) {
			return '#' +
				('0' + parseInt(RegExp.$1, 10).toString(16)).slice(-2) +
				('0' + parseInt(RegExp.$2, 10).toString(16)).slice(-2) +
				('0' + parseInt(RegExp.$3, 10).toString(16)).slice(-2);
		}
		return '#000000';
	},
	/**
	 * Takes a hex string (#RRGGBB or ##RRGGBBAA) and sets the specified opacity and returns a rgba() string
	 * @param {string} string #RRGGBB or #RRGGBBAA
	 * @param {number|string} opacity 0-255
	 * @return {string} "rgba(r, g, b, a)"
	 */
	setOpacityOfHexString: function(string, opacity) {
		if(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.test(string)) {
			return 'rgba(' +
				parseInt(RegExp.$1, 16) + ',' +
				parseInt(RegExp.$2, 16) + ',' +
				parseInt(RegExp.$3, 16) + ',' +
				opacity +
				')';
		}
		return 'rgba(0, 0, 0, 0)';
	},
};
