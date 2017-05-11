const BasePage = require('./base.js');

class WebViewPage extends BasePage {
	//noinspection JSMethodCanBeStatic
	factory(title, html) {
		let page = new tabris.Page({
			title: title,
		});
		new tabris.WebView({
			top: 0, bottom: 0, left: 0, right: 0,
			html: html,
		}).appendTo(page);

		return page;
	}
}

module.exports = WebViewPage;
