const local = require('./adapters/local.js');
const seattle = require('./adapters/seattle.js');
const socrata = require('./adapters/socrata.js');
const timbond = require('./adapters/tim-bond.js');

let instance = null;
const cache = {};

class Geocoder {
	constructor() {
		if(!instance) {
			instance = this;
		}
		return instance;
	}

	/**
	 * @param {string} address
	 * @param {string} incidentId
	 * @return {Promise<LatLon>,<string>}
	 */
	geocode(address, incidentId) {
		return new Promise((resolve, reject) => {
			if(cache[address]) {
				resolve(cache[address]);
			}
			new Promise((resolve, reject) => {
				local.geocode(address).then(resolve).catch(() => {
					socrata.geocode(incidentId).then(resolve).catch(() => {
						seattle.geocode(address).then(resolve).catch(() => {
							timbond.geocode(address, incidentId).then(resolve).catch(reject);
						});
					});
				});
			}).then((result) => {
				cache[address] = result;
				resolve(result);
			}).catch(reject);
		});
	}
}

module.exports = Geocoder;
