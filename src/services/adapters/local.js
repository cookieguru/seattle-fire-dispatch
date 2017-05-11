let LatLon = require('../../models/latlon.js');
let md5 = require('md5');

class LocalGeocoder {
	//noinspection JSMethodCanBeStatic
	/**
	 * @param {string} address
	 * @return {LatLon|null}
	 */
	geocode(address) {
		address = address.toLowerCase();
		let hash = md5(address).substr(0, 3);
		try {
			let bucket = require(`../../../geo_database/${hash}.json`);
			if(bucket[address]) {
				return new LatLon(bucket[address][0], bucket[address][1]);
			}
		} catch(e) {
			return null;
		}
		return null;
	}
}

module.exports = LocalGeocoder;
