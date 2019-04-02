const LatLon = require('../../models/latlon.js');
const {GEOCODER_TIMEOUT} = require('../../constants.json');

const BASE_URL = 'https://gisrevprxy.seattle.gov/ArcGIS/rest/services/locators/SND/GeocodeServer/findAddressCandidates?';
const MINIMUM_CONFIDENCE = 70;

class SeattleGeocoder {
	/**
	 * @param {string} address
	 * @return {Promise<LatLon>,<string>}
	 */
	static geocode(address) {
		return new Promise((resolve, reject) => {
			let params = {
				'Single Line Input': SeattleGeocoder._fixAddress(address),
				'f': 'json',
				'outSR': '{"wkid":4269}',
				'outFields': 'Score',
				'distance': 50000,
				'location': '{"x":-13618022.372263636,"y":6045110.813383518,"spatialReference":{"wkid":102100}}',
				'maxLocations': 5,
			};
			let tmp = [];
			for(let key in params) {
				tmp.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
			}

			fetch(BASE_URL + tmp.join('&'), {
				timeout: GEOCODER_TIMEOUT,
			}).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch from Seattle Geocode Server: ${response.status} ${response.statusText}`);
				}
				return response.json();
			}).then(/** @type {{candidates:object[]}} */json => {
				let maxScore = MINIMUM_CONFIDENCE;
				let ll;
				for(let i = 0; i < json.candidates.length; i++) {
					if(json.candidates[i].score > maxScore) {
						ll = new LatLon(json.candidates[i].location.y, json.candidates[i].location.x);
						maxScore = json.candidates[i].score;
					}
				}
				if(typeof location === 'object') {
					resolve(ll);
				}
				reject('No matches');
			}).catch(err => {
				reject(err.toString());
			});
		});
	}

	/**
	 * Munge the address that SFD reports in to something that the geocoder can understand
	 * @param address
	 * @private
	 */
	static _fixAddress(address) {
		return address.replace(' / ', ' & ');
	}
}

module.exports = SeattleGeocoder;
