let instance = null;

class IncidentDetailsService {
	constructor() {
		if(!instance) {
			instance = this;
		}
		this._baseURL = 'https://www2.ci.seattle.wa.us/fire/incidentSearch/incidentDetail.asp?ID=';
		return instance;
	}

	/**
	 * Gets incident details if available
	 * @param {string} incidentId
	 * @return {Promise<string>,<undefined|string|Error>}
	 */
	getIncidentDetails(incidentId) {
		return new Promise((resolve, reject) => {
			fetch(this.getIncidentDetailsURL(incidentId)).then(response => {
				if(!response.ok) {
					reject(`Unable to fetch report from SFD: ${response.status} ${response.statusText}`);
				}
				return response.text();
			}).then(text => {
				if(text.indexOf('Sorry, no Record Found') >= 0) {
					reject();
				}
				resolve(IncidentDetailsService._parser(text));
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Gets incident details URL
	 * Used for parser error fallback
	 * @param {string} incidentId
	 * @return string
	 */
	getIncidentDetailsURL(incidentId) {
		return this._baseURL + incidentId;
	}

	/**
	 * @param {string} text
	 * @return {string}
	 * @private
	 */
	static _parser(text) {
		let styles = 'body{font-family:Verdana,Arial,Helvetica}.regbold{font-weight:bold}table table{width:100%}' +
			'p{margin:0}font[size="5"]>b,b>font,img{display:none}';
		text = text.replace(/(<td .*?)width="\d+"(.*?>)/g, '$1$2');
		text = text.replace(/(<t(?:d|able) .*?)height="?\d+%?"?(.*?>)/g, '$1$2');
		text = text.replace(/(<table .*?)width="?\d+%?"?(.*?>)/g, '$1$2');
		text = text.replace(/(<td .*?)height="?\d+%?"?(.*?)>/g, '$1$2');
		text = text.replace(/<td width="35%">[\S\s]*?<\/td>/, '');
		text = text.replace(/<script[\S\s]*?<\/script>/g, '');
		text = text.replace(/<a [\S\s]*?<\/a>/g, '');
		text = text.replace('</head>', `<style type="text/css">${styles}</style></head>`);
		return text.replace('</head>', '<meta name="viewport" content="width=device-width"></head>');
	}
}

module.exports = IncidentDetailsService;
