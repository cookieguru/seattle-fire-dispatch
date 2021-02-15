const BasePage = require('./base.js');
const colorUtils = require('../util/colors.js');
const StationsService = require('../services/fetch_stations.js');
const {COLORS} = require('../constants.js');
const {unit} = require('../util/string_formatter.js');

class StationPage extends BasePage {
	/**
	 * @param {{id:string,name:string,address:string,lat:number,lon:number,apparatus:array,reserve:array}} station
	 */
	factory(station) {
		let MARGIN_SMALL = 14;
		let MARGIN = 16;
		let GUTTER = 60;

		let INITIAL_TITLE_COMPOSITE_OPACITY = 0.5;

		let titleCompY = 0;

		let page = new tabris.Page({
			title: typeof station.id === 'number' ? 'Station ' + station.id : station.id,
		});

		page.on('appear', () => {
			this.navigationView.toolbarVisible = false;
		}).on('dispose', () => {
			this.navigationView.toolbarVisible = true;
		});

		//TODO: https://raw.githubusercontent.com/eclipsesource/tabris-js/master/examples/parallax/parallax.js
		let scrollView = new tabris.ScrollView({
			left: 0, right: 0, top: 0, bottom: 0,
		}).appendTo(page);

		let imageView = new tabris.ImageView({
			left: 0, top: 0, right: 0,
			background: '#CCCCCC',
			image: `https://fire.tim-bond.com/stations/photos/${station.id}.jpg`,
			scaleMode: 'fill',
		}).appendTo(scrollView);

		new tabris.ImageView({
			left: MARGIN,
			top: MARGIN,
			highlightOnTouch: true,
			image: {
				src: './images/arrow_back_white.png',
				height: 24,
				width: 24,
			},
		}).appendTo(page).on('tap', () => {
			page.dispose();
		});

		let contentComposite = new tabris.Composite({
			left: 0, right: 0, top: '#titleComposite', height: screen.height - 78,
			background: 'white',
		}).appendTo(scrollView);

		let titleComposite = new tabris.Composite({
			left: 0, right: 0, height: 78,
			id: 'titleComposite',
			background: colorUtils.setOpacityOfHexString(COLORS.RED, INITIAL_TITLE_COMPOSITE_OPACITY),
		}).appendTo(scrollView);

		new tabris.TextView({
			left: GUTTER, top: MARGIN_SMALL, right: MARGIN,
			markupEnabled: true,
			text: '<b>' + (typeof station.id === 'number' ? 'Station ' : '') + station.id + '</b>',
			font: '16px',
			textColor: 'black',
		}).appendTo(titleComposite);

		new tabris.TextView({
			left: GUTTER, bottom: MARGIN_SMALL, right: MARGIN, top: 'prev()',
			markupEnabled: true,
			text: '<b>' + station.name + '</b>',
			font: '24px',
			textColor: 'white',
		}).appendTo(titleComposite);

		scrollView.on('resize', ({height}) => {
			imageView.height = height / 2;
			let titleCompHeight = titleComposite.height;
			titleCompY = Math.min(imageView.height - titleCompHeight, height / 2);
			titleComposite.top = titleCompY;
		});

		scrollView.on('scrollY', ({offset}) => {
			imageView.transform = {translationY: Math.max(0, offset * 0.4)};
			titleComposite.transform = {translationY: Math.max(0, offset - titleCompY)};
			let opacity = calculateTitleCompositeOpacity(offset, titleCompY);
			titleComposite.background = colorUtils.setOpacityOfHexString(COLORS.RED, opacity);
		});

		function calculateTitleCompositeOpacity(scrollViewOffsetY, titleCompY) {
			let titleCompDistanceToTop = titleCompY - scrollViewOffsetY;
			let opacity = 1 - (titleCompDistanceToTop * (1 - INITIAL_TITLE_COMPOSITE_OPACITY)) / titleCompY;
			return opacity <= 1 ? opacity : 1;
		}

		let credit = new tabris.TextView({
			top: ['prev()', 2], left: MARGIN, right: MARGIN,
			font: 'italic 10px',
			text: ' ',
			textColor: 'blue',
		}).appendTo(contentComposite);
		let stationsService = new StationsService();
		stationsService.getPhotoInformation().then(station_photos => {
			if(station_photos[station.id]) {
				/** @type {{author:string,title:string,license:string,link:string}} */
				let photo = station_photos[station.id];
				credit.text = `"${photo.title}" by ${photo.author}`;
				if(photo.license) {
					credit.text += `, ${photo.license}`;
				}
				credit.on('tap', () => {
					// noinspection JSIgnoredPromiseFromCall
					tabris.app.launch(photo.link);
				});
			}
		});
		new tabris.TextView({
			top: ['prev()', MARGIN],
			left: MARGIN,
			right: MARGIN,
			text: station.address,
		}).appendTo(contentComposite);

		new tabris.Composite({
			top: ['prev()', MARGIN], left: MARGIN,
			background: '#CCC',
		}).append(
			new tabris.Composite({
				top: 1, right: 1, bottom: 1, left: 1,
				highlightOnTouch: true,
				background: '#FFF',
			}).append(
				new tabris.TextView({
					top: 6, right: 12, bottom: 6, left: 12,
					font: '12px',
					text: 'MAP',
				}).on('tap', () => {
					//noinspection JSIgnoredPromiseFromCall
					tabris.app.launch('https://maps.google.com/maps?q=' + encodeURIComponent(station.address + ', Seattle, WA'));
				})
			)
		).appendTo(contentComposite);

		let tabFolder = new tabris.TabFolder({
			left: MARGIN, top: ['prev()', MARGIN], right: MARGIN, bottom: MARGIN,
			paging: true,
		}).appendTo(contentComposite);

		tabFolder.append(createTab('Apparatus', station.apparatus));

		if(station.reserve.length) {
			tabFolder.append(createTab('Reserve Apparatus', station.reserve));
		}

		return page;
	}
}
module.exports = StationPage;

function createTab(title, items) {
	let tab = new tabris.Tab({
		title: title,
	});

	new tabris.CollectionView({
		left: 0, top: 0, right: 0, bottom: 0,
		itemCount: items.length,
		cellHeight: 25,
		createCell: () => {
			let cell = new tabris.Composite();
			new tabris.TextView({
				left: 0, centerY: 0, right: 0,
			}).appendTo(cell);
			return cell;
		},
		updateCell: (cell, index) => {
			cell.apply({
				TextView: {text: unit(items[index])},
			});
		},
	}).appendTo(tab);

	return tab;
}
