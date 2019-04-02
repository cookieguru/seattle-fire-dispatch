const LatLon = require('../../models/latlon.js');
const {GEOCODER_TIMEOUT} = require('../../constants.json');

const BASE_URL = 'https://fire.tim-bond.com/geocode?';

class TimBondGeocoder {
	/**
	 * @param {string} address
	 * @param {string} incidentId
	 * @return {Promise<LatLon>,<string>}
	 */
	static geocode(address, incidentId) {
		return new Promise((resolve, reject) => {
			fetch(BASE_URL + 'address=' + encodeURIComponent(address) + '&incident=' + encodeURIComponent(incidentId), {
				timeout: GEOCODER_TIMEOUT,
			}).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch from Tim-Bond: ${response.status} ${response.statusText}`);
				}
				return response.json().then(json => {
					if('lat' in json) {
						resolve(new LatLon(json.lat, json.lon));
					} else {
						reject('No results');
					}
				});
			}).catch(err => {
				reject(err.toString());
			});
		});
	}
}

module.exports = TimBondGeocoder;
