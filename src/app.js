const AboutPage = require('./pages/about.js');
const BorderedCell = require('./components/bordered_cell.js');
const MainPage = require('./pages/main.js');
const StationsPage = require('./pages/stations.js');
const TwitterPage = require('./pages/twitter.js');
const {COLORS} = require('./constants.json');

let navigationView = new tabris.NavigationView({
	left: 0, top: 0, right: 0, bottom: 0,
	drawerActionVisible: true,
	toolbarColor: COLORS.RED,
}).appendTo(tabris.ui.contentView);

tabris.ui.drawer.enabled = true;

let pageNames = [
	'Stations',
	'SFD Twitter',
	'About',
];

new tabris.CollectionView({
	left: 0, top: 0, right: 0, bottom: 0,
	itemCount: pageNames.length,
	createCell: function createCell() {
		let cell = new BorderedCell();
		new tabris.TextView({
			left: 17, centerY: 0,
			font: '16px Roboto Medium',
			textColor: '#212121',
		}).appendTo(cell);
		return cell;
	},
	updateCell: function updateCell(cell, index) {
		let page = pageNames[index];
		cell.apply({
			TextView: {text: page},
		});
	},
	cellHeight: 48,
}).on('select', ({index}) => {
	tabris.ui.drawer.close();
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
}).appendTo(tabris.ui.drawer);

new MainPage(navigationView).factory().appendTo(navigationView);
