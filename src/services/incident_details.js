/* global fetch */
class IncidentDetailsService {
	constructor() {
		this._cache = {};
		this._baseURL = 'http://www2.seattle.gov/fire/incidentSearch/incidentDetail.asp?ID=';
	}
	/**
	 * Gets incident details if available
	 * @param {string} incidentId
	 * @return {Promise<string>,<undefined>}
	 */
	getIncidentDetails(incidentId) {
		return new Promise((resolve, reject) => {
			if(this._cache[incidentId]) {
				resolve(this._cache[incidentId]);
			}

			fetch(this._baseURL + incidentId).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch report from SFD: ${response.status} ${response.statusText}`);
				}
				return response.text();
			}).then(text => {
				if(text.indexOf('Sorry, no Record Found') >= 0) {
					reject();
				}
				this._cache[incidentId] = this._parser(text);
				resolve(this._cache[incidentId]);
			}).catch(err => {
				reject(err);
			});
		});
	}

	//noinspection JSMethodCanBeStatic
	/**
	 * @param {string} text
	 * @return {string}
	 * @private
	 */
	_parser(text) {
		try {
			require('tabris-js-node');
			const cheerio = require('cheerio');
			const $ = cheerio.load(text);

			$('table, td').removeAttr('height').not('td[width="25%"]').removeAttr('width');
			$('p[align="right"]').find('a').closest('td').remove();
			$('script, a ').remove();
			$('table table').css('width', '100%');
			$('head').append('<meta name="viewport" content="width=device-width">');

			return $.html();
		} catch(e) {
			return text;
		}
	}
}

module.exports = IncidentDetailsService;
