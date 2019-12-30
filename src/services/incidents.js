const Incident = require('../models/incident.js');
const {formatDateToSFDString} = require('../util/date.js');

class IncidentsService {
	constructor() {
		this._todayURL = 'https://www2.ci.seattle.wa.us/fire/realTime911/getRecsForDatePub.asp?action=Today&incDate=&rad1=des';
		this._baseURL = 'https://www2.ci.seattle.wa.us/fire/realTime911/getRecsForDatePub.asp?rad1=des&incDate=';
	}

	/**
	 * Gets incident details if available
	 * @param {Date} date The date to fetch or null for the current day
	 * @return {Promise<string>,<string>}
	 */
	getIncidentsUsingRegex(date) {
		return new Promise((resolve, reject) => {
			let url;
			if(date === null) {
				url = this._todayURL;
			} else {
				date = formatDateToSFDString(date);
				url = this._baseURL + date;
			}
			fetch(url).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch data from SFD: ${response.status} ${response.statusText}`);
				}
				return response.text();
			}).then(text => {
				if(text.indexOf('Sorry, no Record Found') >= 0) {
					reject(`No incidents yet for ${date}`);
				}
				if(text.match(/Selected date .* is not on file/)) {
					reject(`No incidents for ${date}`);
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
