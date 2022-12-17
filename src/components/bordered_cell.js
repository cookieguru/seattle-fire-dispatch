const Cell = require('./cell.js');
const {BORDER_COLOR} = require('../constants.js');
const {Composite} = require('tabris');

class BorderedCell extends Cell {
	constructor() {
		super();
		this.append(new Composite({
			left: 0, right: 0, bottom: 0, height: 1,
			background: BORDER_COLOR,
		}));
	}
}

module.exports = BorderedCell;
