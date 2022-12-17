const BasePage = require('./base.js');
const StationPage = require('./station.js');
const {MARGIN} = require('../constants.js');
const {CollectionView, Composite, ImageView, Page, TextView} = require('tabris');

class StationsPage extends BasePage {
	factory() {
		/** @type {Array} */
		const stations = require('../../data/stations.json');
		let page = new Page({
			title: 'Stations',
		});

		const cv = new CollectionView({
			left: 0, top: 0, right: 0, bottom: 0,
			itemCount: stations.length,
			cellHeight: screen.width / 3 * 2,
			createCell: () => {
				let cell = new Composite();
				let outside = new Composite({
					left: MARGIN, top: MARGIN / 2, right: MARGIN, bottom: MARGIN,
					background: '#999999',
					cornerRadius: 2,
					elevation: MARGIN / 2,
				}).appendTo(cell);

				let inside = new Composite({
					left: 1, top: 1, bottom: 2, right: 1,
					background: '#FFFFFF',
					cornerRadius: 2,
				}).appendTo(outside);

				new ImageView({
					left: 0, top: 0, right: 0, bottom: 0,
					image: {
						src: './images/station.png',
					},
					background: '#CCCCCC',
					scaleMode: 'fill',
				}).appendTo(inside);

				new Composite({
					left: 0, right: 0, bottom: 0,
					height: 30,
					background: 'rgba(255, 0, 0, 0.5)',
				}).appendTo(inside);

				new TextView({
					bottom: 5,
					left: 5,
					textColor: '#FFFFFF',
					font: 'bold 18px',
				}).appendTo(inside);

				cell.onTap(() => {
					const index = cv.itemIndex(cell);
					let station = stations[index];
					let pg = new StationPage(this.navigationView).factory(station);
					pg.appendTo(this.navigationView);
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
		}).appendTo(page);

		return page;
	}
}

module.exports = StationsPage;
