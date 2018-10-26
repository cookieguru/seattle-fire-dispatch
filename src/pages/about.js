const BasePage = require('./base.js');
const {MARGIN} = require('../constants.json');

class AboutPage extends BasePage {
	factory() {
		let page = new tabris.Page({
			title: 'About',
		});

		let scrollView = new tabris.ScrollView({
			top: MARGIN,
			bottom: MARGIN,
			left: MARGIN,
			right: MARGIN,
		}).appendTo(page);

		new tabris.TextView({
			top: 0, left: 0, right: 0,
			text: 'Version ' + tabris._client.get('tabris.App', 'version') + ' / ' + tabris.version,
		}).appendTo(scrollView);

		new tabris.TextView({
			top: ['prev()', MARGIN], left: 0, right: 0,
			text: '\u00A9 2017 Tim Bond',
		}).appendTo(scrollView);

		new tabris.TextView({
			top: ['prev()', MARGIN], left: 0, right: 0,
			markupEnabled: true,
			text: 'Bugs?  Comments?  Suggestions?  <a href="#">apps@Tim-Bond.com</a>',
		}).on('tap', () => {
			// noinspection JSIgnoredPromiseFromCall
			tabris.app.launch('mailto:apps@tim-bond.com?subject=Seattle+Fire+Dispatch');
		}).appendTo(scrollView);

		new tabris.Button({
			top: ['prev()', MARGIN], left: 0, right: 0,
			text: 'Learn more about this app',
		}).on('select', () => {
			// noinspection JSIgnoredPromiseFromCall
			tabris.app.launch('https://github.com/cookieguru/seattle-fire-dispatch/wiki/About');
		}).appendTo(scrollView);

		new tabris.TextView({
			top: ['prev()', MARGIN], left: 0, right: 0,
			markupEnabled: true,
			text: 'Special thanks to Max Steinmetz for the app icon',
		}).appendTo(scrollView);

		new tabris.TextView({
			top: ['prev()', MARGIN * 5], left: 0, right: 0,
			font: '10px Roboto',
			text: ['The data made available here has been modified for use from its original source, which is the ',
				'City of Seattle. Neither the City of Seattle nor the Office of the Chief Technology Officer (OCTO) ',
				'makes any claims as to the completeness, timeliness, accuracy or content of any data contained in ',
				'this application; makes any representation of any kind, including, but not limited to, warranty of ',
				'the accuracy or fitness for a particular use; nor are any such warranties to be implied or inferred ',
				'with respect to the information or data furnished herein. The data is subject to change as ',
				'modifications and updates are complete. It is understood that the information contained in the web ',
				'feed is being used at one\'s own risk.'].join(' '),
		}).appendTo(scrollView);

		return page;
	}
}

module.exports = AboutPage;
