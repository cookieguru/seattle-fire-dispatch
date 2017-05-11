/* global fetch */
const Incident = require('../models/incident.js');

class IncidentsService {
	constructor() {
		this._baseURL = 'http://www2.seattle.gov/fire/realTime911/getRecsForDatePub.asp?rad1=des&incDate=';
	}

	/**
	 * Gets incident details if available
	 * @param {string} date
	 * @return {Promise<string>,<string>}
	 */
	getIncidentsUsingRegex(date) {
		return new Promise((resolve, reject) => {
			fetch(this._baseURL + date).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch data from SFD: ${response.status} ${response.statusText}`);
				}
				return response.text();
			}).then(text => {
				if(text.indexOf('Sorry, no Record Found') >= 0) {
					reject(`No incidents yet for ${date}`);
				}
				//eslint-disable-next-line max-len
				let re = /<tr id.*?>[\S\s]*?<td class="?(.*?)".*?>(.*?)<\/td>[\S\s]*?<td.*?>(.*?)<\/td>[\S\s]*?<td.*?>(.*?)<\/td>[\S\s]*?<td.*?>(.*?)<\/td>[\S\s]*?<td.*?>(.*?)<\/td>[\S\s]*?<td.*?>(.*?)<\/td>[\S\s]*?<\/tr>/g;
				let m;
				let results = [];
				do {
					m = re.exec(text);
					if(m) {
						let incident = new Incident();
						let level = parseInt(m[4]);
						incident.active = m[1] === 'active';
						incident.date = new Date(m[2]);
						incident.incident = m[3];
						incident.level = m[4] === level + '' ? level : m[4] || null;
						incident.units = m[5].split(' ');
						incident.address = m[6];
						incident.type = m[7];
						results.push(incident);
					}
				} while(m);
				if(results.length === 0) {
					reject(`Unable to load incidents for ${date}.  The app is probably broken`);
				}
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		});
	}
}

module.exports = IncidentsService;
