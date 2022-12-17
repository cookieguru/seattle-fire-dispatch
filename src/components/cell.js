const {Composite} = require('tabris');

class Cell extends Composite {
	constructor() {
		super();
		let highlight = true;
		if(device.platform === 'Android' && device.version < 23) {
			highlight = false;
		}
		this.highlightOnTouch = highlight;
	}
}

module.exports = Cell;
