const BasePage = require('./base.js');
const dateFmt = require('../util/date.js');
const Map = require('../components/map.js');
const IncidentDetailsService = require('../services/incident_details.js');
const Geocoder = require('../services/geocoder.js');
const LocatedIncident = require('../models/located_incident.js');
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
		new Geocoder().geocode(address, incidentId).then(ll => {
			new Map({
				top: 0, left: 0, right: 0, height: height,
			}, [new LocatedIncident(null, ll)]).appendTo(mapContainer);
		}).catch((e) => {
			new tabris.AlertDialog({
				message: e.message,
				buttons: {
					ok: 'OK',
				},
			}).open();
		});

		let scrollView = new tabris.ScrollView({
			top: ['prev()', 0], bottom: 0, left: 0, right: 0,
		}).appendTo(page);

		let dateText = new tabris.TextView({
			top: ['prev()', 16], left: 16, right: 16,
		}).appendTo(scrollView);
		dateFmt.formatDate(timestamp).then((string) => {
			dateText.text = string;
		});
		let typeText = new tabris.TextView({
			top: ['prev()', 5],
			left: 16,
			right: 16,
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
			left: 16,
			right: 16,
			text: address,
		}).appendTo(scrollView);
		if(level !== null) {
			new tabris.TextView({
				top: ['prev()', 5],
				left: 16,
				right: 16,
				text: 'Alarm level ' + level,
			}).appendTo(scrollView);
		}

		//Only using this component for the header styling
		new tabris.TabFolder({
			left: 16, top: ['prev()', 16], right: 16,
			paging: true,
		}).append(
			new tabris.Tab({
				title: 'Responding units',
			})
		).appendTo(scrollView);

		for(let i in units) {
			new tabris.TextView({
				left: 16, top: ['prev()', 8], right: 16,
				text: strFmt.unit(units[i]),
			}).appendTo(scrollView);
		}

		//Bottom "margin"
		new tabris.Composite({
			top: ['prev()', 16],
		}).appendTo(scrollView);

		page.apply({
			TextView: {font: '18px Roboto'},
		});

		return page;
	}
}

module.exports = IncidentPage;
