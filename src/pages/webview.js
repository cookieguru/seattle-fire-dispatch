const BasePage = require('./base.js');

class WebViewPage extends BasePage {
	factory(title) {
		this.page = new tabris.Page({
			title: title,
		});

		this.spinner = new tabris.ActivityIndicator({
			centerX: 0,
			centerY: 0,
		}).appendTo(this.page);

		this.wv = new tabris.WebView({
			top: 0, bottom: 0, left: 0, right: 0,
			visible: false,
		}).on('load', () => {
			this.wv.visible = true;
			this.spinner.dispose();
		}).appendTo(this.page);

		return this.page;
	}

	set html(html) {
		this.wv.html = html;
		this.wv.visible = true;
		this.spinner.dispose();
	}

	set url(url) {
		this.wv.url = url;
		this.wv.visible = true;
		this.spinner.dispose();
	}
}

module.exports = WebViewPage;
