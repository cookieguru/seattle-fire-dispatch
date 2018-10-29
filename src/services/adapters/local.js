const LatLon = require('../../models/latlon.js');
const md5 = require('md5');

class LocalGeocoder {
	/**
	 * @param {string} address
	 * @return {Promise<LatLon>,<string>}
	 */
	static geocode(address) {
		address = address.trim().toLowerCase();
		/** @type {string} */
		let hash = md5(address);
		hash = hash.substr(0, 2);
		return new Promise((resolve, reject) => {
			try {
				const bucket = require(`../../../geo_database/${hash}.json`);
				if(bucket[address]) {
					resolve(new LatLon(bucket[address][0], bucket[address][1]));
				} else {
					reject('Not geocoded');
				}
			} catch(e) {
				reject(e.toString());
			}
		});
	}
}

module.exports = LocalGeocoder;
