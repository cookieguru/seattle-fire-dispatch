module.exports = {
	/**
	 * Returns the friendly name of the unit
	 * @constructor
	 * @param {string} string Unit string, e.g. E8
	 * @return {string} A description of the unit, e.g. Engine 8
	 */
	unit: function(string) {
		let match = string.match(/(\d+)$/);
		let num = match ? parseInt(match[1]) : '';

		const units = require('../../data/units.json');
		for(let regex in units) {
			//noinspection JSUnresolvedFunction
			if(!units.hasOwnProperty(regex)) {
				continue;
			}
			if(string.match(new RegExp(regex))) {
				return units[regex].replace('#', num);
			}
		}

		return string;
	},

	/**
	 * Un-abbreviates and returns a friendlier incident_type type
	 * @constructor
	 * @param {string} string Incident type
	 * @return {string} Incident type
	 */
	incident_type: function(string) {
		string = string.replace(/ {2}/g, ' ');
		const types = require('../../data/incident_types.json');
		if(types[string]) {
			return types[string];
		}
		return string;
	},

	/**
	 * Provides a description of the incident_type or null if one is not available
	 * @param {string} string The incident_type type
	 * @return {string|null} The description of the incident_type type
	 */
	incident_description: function(string) {
		string = string.replace(/ {2}/g, ' ');
		const descriptions = require('../../data/incident_descriptions.json');
		if(descriptions[string]) {
			return descriptions[string];
		}
		return null;
	},
};
