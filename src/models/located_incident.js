class LocatedIncident {
	/**
	 * @param {Incident} incident
	 * @param {LatLon} location
	 */
	constructor(incident, location) {
		this.incident = incident;
		this.location = location;
	}
}

module.exports = LocatedIncident;
