const BasePage = require('./base.js');

class WebViewPage extends BasePage {
	factory(title) {
		let page = new tabris.Page({
			title: title,
		});
		this.wv = new tabris.WebView({
			top: 0, bottom: 0, left: 0, right: 0,
		}).appendTo(page);

		return page;
	}

	set html(html) {
		this.wv.html = html;
	}

	set url(url) {
		this.wv.url = url;
	}
}

module.exports = WebViewPage;
