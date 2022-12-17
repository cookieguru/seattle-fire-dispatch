const AboutPage = require('./pages/about.js');
const BorderedCell = require('./components/bordered_cell.js');
const MainPage = require('./pages/main.js');
const StationsPage = require('./pages/stations.js');
const TwitterPage = require('./pages/twitter.js');
const {COLORS} = require('./constants.js');
const {CollectionView, NavigationView, TextView, contentView, drawer} = require('tabris');

let navigationView = new NavigationView({
	left: 0, top: 0, right: 0, bottom: 0,
	drawerActionVisible: true,
	toolbarColor: COLORS.RED,
}).appendTo(contentView);

drawer.enabled = true;

let pageNames = [
	'Stations',
	'SFD Twitter',
	'About',
];

const nav = new CollectionView({
	left: 0, top: 0, right: 0, bottom: 0,
	itemCount: pageNames.length,
	createCell: function createCell() {
		let cell = new BorderedCell();
		new TextView({
			left: 17, centerY: 0,
			font: '16px Roboto Medium',
			textColor: '#212121',
		}).appendTo(cell);

		cell.onTap(() => {
			const index = nav.itemIndex(cell);
			drawer.close();
			let name = pageNames[index];
			let page;
			if(name === 'Stations') {
				page = new StationsPage(navigationView).factory();
			} else if(name === 'SFD Twitter') {
				page = new TwitterPage(navigationView).factory();
			} else if(name === 'About') {
				page = new AboutPage(navigationView).factory();
			}
			page.appendTo(navigationView);
		});

		return cell;
	},
	updateCell: (cell, index) => {
		let page = pageNames[index];
		cell.apply({
			TextView: {text: page},
		});
	},
	cellHeight: 48,
}).appendTo(drawer);

new MainPage(navigationView).factory().appendTo(navigationView);
