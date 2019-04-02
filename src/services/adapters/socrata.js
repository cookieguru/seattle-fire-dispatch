const LatLon = require('../../models/latlon.js');
const {GEOCODER_TIMEOUT} = require('../../constants.json');

const BASE_URL = 'https://data.seattle.gov/resource/kzjm-xkqj.json?incident_number=';

class SocrataGeocoder {
	/**
	 * @param {string} incidentId
	 * @return {Promise<LatLon>,<string>}
	 */
	static geocode(incidentId) {
		return new Promise((resolve, reject) => {
			fetch(BASE_URL + encodeURIComponent(incidentId), {
				timeout: GEOCODER_TIMEOUT,
			}).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch from Seattle Data: ${response.status} ${response.statusText}`);
				}
				return response.json().then(json => {
					if(json.length) {
						try {
							resolve(new LatLon(parseFloat(json[0].latitude), parseFloat(json[0].longitude)));
						} catch(e) {
							reject(e.toString());
						}
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

module.exports = SocrataGeocoder;
