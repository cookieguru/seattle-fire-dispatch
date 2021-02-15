const BasePage = require('./base.js');
const BorderedCell = require('../components/bordered_cell.js');
const IncidentPage = require('./incident.js');
const IncidentsService = require('../services/incidents.js');
const MapPage = require('./map.js');
const strFmt = require('../util/string_formatter.js');
const {COLORS} = require('../constants.js');
const {convertToSeattleDate, formatTime, getTodayDate} = require('../util/date');

class MainPage extends BasePage {
	constructor(navigationView) {
		super(navigationView);
		this.incidentsService = new IncidentsService();
		this.date = null;
	}

	factory() {
		this.page = new tabris.Page({
			title: 'Seattle Fire Dispatch',
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
					top: 12, left: 16, right: 16,
					id: 'type',
					font: 'bold 18px',
				}).appendTo(cell);
				let address = new tabris.TextView({
					top: [type, 4], left: 16, right: 16,
					id: 'address',
					font: '15px',
				}).appendTo(cell);
				let units = new tabris.TextView({
					top: [address, 4], left: 16, right: 16,
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
				formatTime(incident.date).then((time) => {
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
		}).appendTo(this.page);

		this._setupActions();

		this._loadIncidents(this.date);

		return this.page;
	}

	/**
	 * @param {Date} date
	 * @return void
	 * @private
	 */
	_loadIncidents(date) {
		this.actions.map((action) => {
			action.enabled = false;
		});

		if(this.date !== date) {
			this.incidents = [];
			this.view.load(0);
			this.view.refreshEnabled = this.date === null;
			this.actions.map((action) => {
				if(action.id === 'active-incidents-action') {
					action.visible = false;
				}
			});
		}
		this.date = date;

		this.view.refreshIndicator = true;
		this.view.refreshMessage = 'loading...';
		this.incidentsService.getIncidentsUsingRegex(date).then(items => {
			this.incidents = items;
			if(this.view.itemCount < this.incidents.length) {
				this.view.insert(0, this.incidents.length - this.view.itemCount);
			} else if(this.view.itemCount > this.incidents.length) {
				this.view.remove(0, this.view.itemCount - this.incidents.length);
			}
			this.view.load(this.incidents.length);
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

			this.actions.map((action) => {
				action.enabled = true;
			});
		});
	}

	_setupActions() {
		this.actions = [
			new tabris.Action({
				title: 'Calendar',
				image: {
					src: 'images/calendar.png',
					scale: 3,
				},
			}).on('select', () => {
				let latestIncidentDate;
				if(this.incidents[0]) {
					latestIncidentDate = this.incidents[0].date;
				} else {
					latestIncidentDate = new Date();
				}
				new tabris.DateDialog({
					date: latestIncidentDate,
					minDate: new Date('2003-11-07 09:30:48'),
					maxDate: getTodayDate(),
				}).on({
					select: ({date}) => {
						if(date) {
							this._loadIncidents(convertToSeattleDate(date));
						}
					},
				}).open();
			}).appendTo(this.navigationView),
			new tabris.Action({
				title: 'Active Incidents',
				id: 'active-incidents-action',
				image: {
					src: 'images/map.png',
					scale: 3,
				},
			}).on('select', () => {
				/** @type {Incident[]} */
				let activeIncidents = this.incidents.filter((incident) => {
					return incident.active;
				});
				if(activeIncidents.length === 0) {
					new tabris.AlertDialog({
						message: 'There are no active incidents right now',
						buttons: {
							ok: 'OK',
						},
					}).open();
					return;
				}
				new MapPage(this.navigationView).factory(activeIncidents).appendTo(this.navigationView);
			}).appendTo(this.navigationView),
		];

		this.page.on('disappear', () => {
			this.actions.map((action) => {
				action.visible = false;
			});
		}).on('appear', () => {
			this.actions.map((action) => {
				action.visible = true;
			});
		});
	}
}

module.exports = MainPage;
