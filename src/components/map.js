/* global window */
class Map extends esmaps.Map {
	/**
	 * @param {object} options
	 * @param {LocatedIncident[]} incidents
	 * @param {function} [tapHandler]
	 * @return {Map}
	 */
	constructor(options, incidents, tapHandler) {
		super(options);

		this.incidentCount = 0;

		this.on('ready', () => {
			if(incidents && incidents.length) {
				incidents.forEach((incident) => {
					this.addIncident(incident);
				});
			}
		});

		this.tapHandler = tapHandler;

		this.minLat = Infinity;
		this.maxLat = -Infinity;
		this.minLon = Infinity;
		this.maxLon = -Infinity;

		return this;
	}

	/**
	 * @param {LocatedIncident} incident
	 * @return {Map}
	 */
	addIncident(incident) {
		this.addMarker(new esmaps.Marker({
			position: [incident.location.lat, incident.location.lon],
		}).on('tap', () => {
			if(typeof this.tapHandler === 'function') {
				this.tapHandler(incident.incident);
			}
		}));

		this.minLat = Math.min(this.minLat, incident.location.lat);
		this.minLon = Math.min(this.minLon, incident.location.lon);
		this.maxLat = Math.max(this.maxLat, incident.location.lat);
		this.maxLon = Math.max(this.maxLon, incident.location.lon);

		this.incidentCount++;

		if(this.incidentCount === 1) {
			this.moveToPosition([this.minLat, this.minLon], 500, {
				padding: 0,
				animate: false,
			});
		} else {
			this.moveToRegion({
				southWest: [this.minLat, this.minLon],
				northEast: [this.maxLat, this.maxLon],
			}, {
				padding: 16 * window.devicePixelRatio,
				animate: false,
			});
		}
	}
}

module.exports = Map;
