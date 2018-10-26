const BasePage = require('./base.js');
const BorderedCell = require('../components/bordered_cell.js');
const dateFmt = require('../util/date.js');
const dateUtil = require('../util/date.js');
const IncidentPage = require('./incident.js');
const IncidentsService = require('../services/incidents.js');
const strFmt = require('../util/string_formatter.js');
const {COLORS} = require('../constants.json');

class MainPage extends BasePage {
	constructor(navigationView) {
		super(navigationView);
		this.incidentsService = new IncidentsService();
		this.date = dateUtil.getTodayString();
	}

	factory() {
		let page = new tabris.Page({
			title: 'Seattle Fire',
		});

		/** @type {Incident[]} */
		this.incidents = [];

		this.view = new tabris.CollectionView({
			left: 0, top: 0, right: 0, bottom: 0,
			cellHeight: 'auto',
			refreshEnabled: true,
			createCell: () => {
				let cell = new BorderedCell();

				new tabris.TextView({
					top: 12, right: 16,
					id: 'time',
					font: 'black 18px',
				}).appendTo(cell);
				let type = new tabris.TextView({
					top: 8, left: 16, right: 16,
					id: 'type',
					font: 'bold 18px',
				}).appendTo(cell);
				let address = new tabris.TextView({
					top: [type, 4], left: 16, right: 16,
					id: 'address',
					font: '15px',
				}).appendTo(cell);
				let units = new tabris.TextView({
					top: [address, 4], left: 18, right: 16,
					id: 'units',
					font: '14px',
				}).appendTo(cell);

				//Bottom "margin"
				new tabris.Composite({
					top: [units, 12],
				}).appendTo(cell);

				return cell;
			},
			updateCell: (cell, index) => {
				let incident = this.incidents[index];
				dateFmt.formatTime(incident.date).then((time) => {
					cell.children('#time')[0].set({
						text: time,
						textColor: incident.active ? COLORS.ACTIVE : 'initial',
					});
				});
				cell.children('#type')[0].text = strFmt.incident_type(incident.type);
				cell.children('#address')[0].text = incident.address;
				cell.children('#units')[0].text = incident.units.join(', ');
			},
		}).on('refresh', () => {
			this._loadIncidents(this.date);
		}).on('select', ({index}) => {
			let incident = this.incidents[index];
			let pg = new IncidentPage(this.navigationView).factory(incident.incident, incident.date, incident.type,
				incident.address, incident.level, incident.units);
			pg.appendTo(this.navigationView);
		}).appendTo(page);

		this._loadIncidents(this.date);


		return page;
	}

	/**
	 * @param {string} date
	 * @return void
	 * @private
	 */
	_loadIncidents(date) {
		this.view.refreshIndicator = true;
		this.view.refreshMessage = 'loading...';
		this.incidents = this.incidentsService.getIncidentsUsingRegex(date).then(items => {
			this.incidents = items;
			if(this.view.itemCount < this.incidents.length) {
				this.view.insert(0, this.incidents.length - this.view.itemCount);
			} else if(this.view.itemCount > this.incidents.length) {
				this.view.remove(0, this.view.itemCount - this.incidents.length);
			}
			this.view.refresh();
		}).catch(err => {
			new tabris.AlertDialog({
				message: err,
				buttons: {
					ok: 'OK',
				},
			}).open();
		}).then(() => {
			this.view.refreshIndicator = false;
			this.view.refreshMessage = '';
			this.view.reveal(0);
		});
	}
}

module.exports = MainPage;
