/*global navigator */
const moment = require('moment-timezone');

const MOMENT_SFD_DATE_FORMAT = 'M/D/Y';
let deviceLang = tabris.device.language.replace(/-.*/, '');

function getTodayString() {
	return moment.tz('America/Los_Angeles').format(MOMENT_SFD_DATE_FORMAT);
}

function formatDate(dt) {
	if(!(dt instanceof Date)) {
		dt = new Date(dt);
	}
	return new Promise(resolve => {
		if(navigator.globalization) {
			navigator.globalization.dateToString(dt, date => {
				resolve(date.value);
			}, null /* no error callback */, {
				formatLength: 'medium',
				selector: 'date and time',
			});
		}
		let fmt = moment.localeData(deviceLang).longDateFormat('LL');
		fmt += ' ' + moment.localeData(deviceLang).longDateFormat('LTS');
		resolve(moment(dt).format(fmt));
	});
}

/**
 * Formats a timestamp as a time string
 * @param {Date|number} dt A Date or a timestamp to format
 * @return {Promise<string>} Resolves with a formatted timestamp according to device settings or Date locale
 */
function formatTime(dt) {
	if(!(dt instanceof Date)) {
		dt = new Date(dt);
	}
	return new Promise(resolve => {
		if(navigator.globalization) {
			navigator.globalization.dateToString(dt, date => {
				resolve(date.value);
			}, null /* no error callback */, {
				formatLength: 'short',
				selector: 'time',
			});
		}
		let fmt = moment.localeData(deviceLang).longDateFormat('LT');
		resolve(moment(dt).format(fmt));
	});
}

module.exports = {
	getTodayString: getTodayString,
	formatDate: formatDate,
	formatTime: formatTime,
};
