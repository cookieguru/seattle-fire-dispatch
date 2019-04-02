const BasePage = require('./base.js');
const {rgbaToHex} = require('../util/colors.js');

class TwitterPage extends BasePage {
	factory() {
		let page = new tabris.Page({
			title: 'Tweets by @SeattleFire',
			autoDispose: false,
		});

		new tabris.ActivityIndicator({
			centerX: 0,
			centerY: 0,
		}).appendTo(page);

		// noinspection JSUnresolvedLibraryURL
		let webView = new tabris.WebView({
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			background: 'transparent',
			html: `<!DOCTYPE html>
			<html>
			<head>
				<meta name="viewport" content="width=device-width">
				<style>
					body{margin:0}
					a.twitter-timeline{visibility:hidden}
				</style>
			</head>
			<body>
				<a
					class="twitter-timeline" 
					data-chrome="noheader" 
					data-dnt="true" 
					data-link-color="${rgbaToHex(this.navigationView.toolbarColor)}"
					data-show-replies="true" 
					data-width="$(screen.width * window.devicePixelRatio}"
					href="https://twitter.com/SeattleFire"
				>Tweets by SeattleFire</a>
				<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
			</body>
			</html>`,
		}).on('navigate', (event) => {
			if(event.url.substr(0, 4) !== 'http') {
				return;
			}
			// noinspection JSIgnoredPromiseFromCall
			tabris.app.launch(event.url);
			event.preventDefault();
		}).appendTo(page);

		let backNav = function(event) {
			if(webView.canGoBack) {
				webView.goBack();
				event.preventDefault();
			}
		};

		tabris.app.on('backNavigation', backNav);
		page.on('disappear', () => {
			tabris.app.off('backNavigation', backNav);
		});

		return page;
	}
}
module.exports = TwitterPage;
