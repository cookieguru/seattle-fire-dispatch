const moment = require('moment-timezone');

const MOMENT_SFD_DATE_FORMAT = 'M/D/Y';
const deviceLang = tabris.device.language.replace(/-.*/, '');

function formatDateToSFDString(date) {
	return moment(date).format(MOMENT_SFD_DATE_FORMAT);
}

/**
 * Returns the current timestamp of today's date in Seattle time
 * @return {Date}
 */
function getTodayDate() {
	let momentDate = moment.tz('America/Los_Angeles');
	return new Date(momentDate.year(), momentDate.month(), momentDate.date());
}

/**
 * Formats a date to the device's locale
 * @param {Date|number} dt A Date or a timestamp to format
 * @return {Promise<string>}
 */
function formatDate(dt) {
	if(!(dt instanceof Date)) {
		dt = new Date(dt);
	}
	return new Promise(resolve => {
		if(navigator.globalization) {
			navigator.globalization.dateToString(dt, date => {
				resolve(date.value);
			}, () => {
				formatWithMoment(dt);
			}, {
				formatLength: 'long',
				selector: 'date and time',
			});
		} else {
			formatWithMoment(dt);
		}
		function formatWithMoment(dt) {
			let fmt = moment.localeData(deviceLang).longDateFormat('LL');
			fmt += ' ' + moment.localeData(deviceLang).longDateFormat('LTS');
			resolve(moment(dt).format(fmt));
		}
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
			}, () => {
				formatWithMoment();
			}, {
				formatLength: 'short',
				selector: 'time',
			});
		} else {
			formatWithMoment(dt);
		}
		function formatWithMoment(dt) {
			let fmt = moment.localeData(deviceLang).longDateFormat('LT');
			resolve(moment(dt).format(fmt));
		}
	});
}

module.exports = {
	formatDate: formatDate,
	formatDateToSFDString: formatDateToSFDString,
	formatTime: formatTime,
	getTodayDate: getTodayDate,
};
