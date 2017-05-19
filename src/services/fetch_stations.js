class StationsService {
	/**
	 * Gets photo information
	 * @return {Promise<string>,<string>}
	 */
	getPhotoInformation() {
		return new Promise((resolve, reject) => {
			fetch('http://fire.tim-bond.com/stations/index.json').then(response => {
				if(!response.ok) {
					reject(`Unable to fetch data: ${response.status} ${response.statusText}`);
				}
				return response.json();
			}).then(resolve).catch(reject);
		});
	}
}

module.exports = StationsService;
