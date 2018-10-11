const BasePage = require('./base.js');
const dateFmt = require('../util/date.js');
const GoogleInteractiveMap = require('../components/maps/google/interactive.js');
const GoogleStaticMap = require('../components/maps/google/static.js');
const IncidentDetailsService = require('../services/incident_details.js');
const LocalGeocoder = require('../services/adapters/local.js');
const strFmt = require('../util/string_formatter.js');
const WebViewPage = require('./webview.js');

class IncidentPage extends BasePage {
	/**
	 * @param {string} incidentId
	 * @param {Date} timestamp
	 * @param {string} type
	 * @param {string} address
	 * @param {string} level
	 * @param {Array} units
	 */
	factory(incidentId, timestamp, type, address, level, units) {
		let page = new tabris.Page({
			title: incidentId,
		});

		let action = new tabris.Action({
			title: 'Details',
			image: {
				src: './images/details.png',
				scale: 3,
			},
		}).on('select', () => {
			let incdDetSvc = new IncidentDetailsService();
			let wv = new WebViewPage(this.navigationView);
			wv.factory('Incident Report Detail').appendTo(this.navigationView);
			incdDetSvc.getIncidentDetails(incidentId).then(html => {
				wv.html = html;
			}).catch(() => {
				wv.url = incdDetSvc.getIncidentDetailsURL(incidentId);
			});
		}).appendTo(this.navigationView);

		page.on('disappear', () => {
			if(!action.isDisposed()) {
				action.visible = false;
			}
		});
		page.on('appear', () => {
			action.visible = true;
		});
		page.on('dispose', () => {
			action.dispose();
		});

		let height = Math.floor(screen.height / 3);
		let mapContainer = new tabris.Composite({
			top: 0, left: 0, right: 0,
			height: height,
		}).appendTo(page);
		LocalGeocoder.geocode(address).then(ll => {
			new GoogleInteractiveMap({
				top: 0, left: 0, right: 0, height: height,
			}, ll.lat, ll.lon).appendTo(mapContainer);
		}).catch(() => {
			new GoogleStaticMap({
				top: 0, centerX: 0,
				height: height,
				width: screen.width,
			}).setLocation(`${address}, Seattle, WA`).appendTo(mapContainer);
		});

		let scrollView = new tabris.ScrollView({
			top: ['prev()', 0], bottom: 0, left: 0, right: 0,
		}).appendTo(page);

		let dateText = new tabris.TextView({
			top: ['prev()', 5], left: 5, right: 5,
		}).appendTo(scrollView);
		dateFmt.formatDate(timestamp).then((string) => {
			dateText.text = string;
		});
		let typeText = new tabris.TextView({
			top: ['prev()', 5],
			left: 5,
			right: 5,
			text: strFmt.incident_type(type),
		}).appendTo(scrollView);
		let description = strFmt.incident_description(type);
		if(description) {
			typeText.textColor = '#00F';
			typeText.on('tap', () => {
				new tabris.AlertDialog({
					title: strFmt.incident_type(type),
					message: description,
					buttons: {
						ok: 'OK',
					},
				}).open();
			});
		}
		new tabris.TextView({
			top: ['prev()', 5],
			left: 5,
			right: 5,
			text: address,
		}).appendTo(scrollView);
		if(level !== null) {
			new tabris.TextView({
				top: ['prev()', 5],
				left: 5,
				right: 5,
				text: 'Alarm level ' + level,
			}).appendTo(scrollView);
		}

		let tabFolder = new tabris.TabFolder({
			left: 5, top: ['prev()', 5], right: 5, bottom: 5,
			paging: true,
		}).appendTo(scrollView);

		let tab = new tabris.Tab({
			title: 'Responding units',
		}).appendTo(tabFolder);

		for(let i in units) {
			new tabris.TextView({
				left: 0, top: ['prev()', 5], right: 0,
				text: strFmt.unit(units[i]),
			}).appendTo(tab);
		}

		page.apply({
			TextView: {font: '18px Roboto'},
		});

		return page;
	}
}

module.exports = IncidentPage;
