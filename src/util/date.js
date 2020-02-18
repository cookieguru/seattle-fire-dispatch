const spacetime = require('spacetime');

function formatDateToSFDString(date) {
	return spacetime(date).format('numeric-us');
}

/**
 * Returns the current timestamp of today's date in Seattle time
 * @return {Date}
 */
function getTodayDate() {
	const date = spacetime.now('America/Los_Angeles');
	return new Date(date.year(), date.month(), date.date());
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
				formatWithSpacetime(dt);
			}, {
				formatLength: 'long',
				selector: 'date and time',
			});
		} else {
			formatWithSpacetime(dt);
		}
		function formatWithSpacetime(dt) {
			const offset = dt.getTimezoneOffset();
			resolve(spacetime(dt, 'UTC').subtract(offset, 'minute').format('nice'));
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
				formatWithSpacetime(dt);
			}, {
				formatLength: 'short',
				selector: 'time',
			});
		} else {
			formatWithSpacetime(dt);
		}
		function formatWithSpacetime(dt) {
			const offset = dt.getTimezoneOffset();
			resolve(spacetime(dt, 'UTC').subtract(offset, 'minute').format('time'));
		}
	});
}

module.exports = {
	formatDate: formatDate,
	formatDateToSFDString: formatDateToSFDString,
	formatTime: formatTime,
	getTodayDate: getTodayDate,
};
