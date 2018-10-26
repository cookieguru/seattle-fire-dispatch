class BasePage {
	/**
	 * @param {NavigationView} navigationView
	 */
	constructor(navigationView) {
		/** @type {NavigationView|Composite} */
		this.navigationView = navigationView;
	}
}

module.exports = BasePage;
