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
		text = text.replace(/(<td .*?)width="\d+"(.*?>)/g, '$1$2');
		text = text.replace(/(<t(?:d|able) .*?)height="?\d+%?"?(.*?>)/g, '$1$2');
		text = text.replace(/(<table .*?)width="?\d+%?"?(.*?>)/g, '$1$2');
		text = text.replace(/(<td .*?)height="?\d+%?"?(.*?)>/g, '$1$2');
		text = text.replace(/<td width="35%">[\S\s]*?<\/td>/, '');
		text = text.replace(/<script[\S\s]*?<\/script>/g, '');
		text = text.replace(/<a [\S\s]*?<\/a>/g, '');
		text = text.replace('</head>', '<style type="text/css">table table{width:100%}p{margin:0}</style></head>');
		return text.replace('</head>', '<meta name="viewport" content="width=device-width"></head>');
	}
}

module.exports = IncidentDetailsService;
