class LatLon {
	/**
	 * @constructor
	 * @param {number} lat
	 * @param {number} lon
	 */
	constructor(lat, lon) {
		this._lat = lat;
		this._lon = lon;
	}

	/**
	 * @return {number}
	 */
	get lat() {
		return this._lat;
	}

	/**
	 * @return {number}
	 */
	get lon() {
		return this._lon;
	}
}

module.exports = LatLon;
