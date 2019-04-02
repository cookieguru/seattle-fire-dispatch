const BasePage = require('./base.js');
const StationPage = require('./station.js');
const {MARGIN} = require('../constants.json');

class StationsPage extends BasePage {
	factory() {
		/** @type {Array} */
		const stations = require('../../data/stations.json');
		let page = new tabris.Page({
			title: 'Stations',
		});

		new tabris.CollectionView({
			left: 0, top: 0, right: 0, bottom: 0,
			itemCount: stations.length,
			cellHeight: screen.width / 3 * 2,
			createCell: () => {
				let cell = new tabris.Composite();
				let outside = new tabris.Composite({
					left: MARGIN, top: MARGIN / 2, right: MARGIN, bottom: MARGIN,
					background: '#999999',
					cornerRadius: 2,
					elevation: MARGIN / 2,
				}).appendTo(cell);

				let inside = new tabris.Composite({
					left: 1, top: 1, bottom: 2, right: 1,
					background: '#FFFFFF',
					cornerRadius: 2,
				}).appendTo(outside);

				new tabris.ImageView({
					left: 0, top: 0, right: 0, bottom: 0,
					image: {
						src: './images/station.png',
					},
					background: '#CCCCCC',
					scaleMode: 'fill',
				}).appendTo(inside);

				new tabris.Composite({
					left: 0, right: 0, bottom: 0,
					height: 30,
					background: 'rgba(255, 0, 0, 0.5)',
				}).appendTo(inside);

				let name = new tabris.TextView({
					bottom: 5,
					left: 5,
					textColor: '#FFFFFF',
					font: 'bold 18px',
				}).appendTo(inside);

				cell.on('change:item', (widget, station) => {
					name.text = station.id + ': ' + station.name;
				});
				return cell;
			},
			updateCell: (cell, index) => {
				let station = stations[index];
				cell.apply({
					ImageView: {image: {src: `https://fire.tim-bond.com/stations/photos/${station.id}.jpg`}},
					TextView: {text: typeof station.id === 'number' ? `${station.id} ${station.name}` : station.name},
				});
			},
		}).on('select', ({index}) => {
			let station = stations[index];
			let pg = new StationPage(this.navigationView).factory(station);
			pg.appendTo(this.navigationView);
		}).appendTo(page);

		return page;
	}
}

module.exports = StationsPage;
