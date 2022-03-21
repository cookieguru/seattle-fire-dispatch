const BasePage = require('./base.js');
const Map = require('../components/map.js');
const IncidentPage = require('./incident.js');
const LocatedIncident = require('../models/located_incident.js');
const Geocoder = require('../services/geocoder.js');
const {DEFAULT_LAT_LON} = require('../constants.js');

class MapPage extends BasePage {
	/**
	 * @param {Incident[]} incidents
	 * @return {Page}
	 */
	factory(incidents) {
		this.page = new tabris.Page({
			title: incidents.length + ' Active Incident' + (incidents.length === 1 ? '' : 's'),
		});

		new Map({
			top: 0, left: 0, right: 0, bottom: 0,
		}, null, (incident) => {
			let pg = new IncidentPage(this.navigationView).factory(incident.incident, incident.date, incident.type,
				incident.address, incident.level, incident.units);
			pg.appendTo(this.navigationView);
		}).on('ready', (evt) => {
			let map = evt.target;
			map.moveToPosition(DEFAULT_LAT_LON, 5000);
			let geocoder = new Geocoder();

			let locatedIncidents = 0;
			incidents.forEach((incident) => {
				geocoder.geocode(incident.address, incident.incident).then((latLon) => {
					map.addIncident(new LocatedIncident(incident, latLon));
					if(++locatedIncidents === incidents.length) {
						spinner.dispose();
					}
				});
			});
		}).appendTo(this.page);

		let spinner = new tabris.ActivityIndicator({
			top: 0, left: 0, right: 0, bottom: 0,
			opacity: 0.5,
		}).appendTo(this.page);

		return this.page;
	}
}

module.exports = MapPage;
