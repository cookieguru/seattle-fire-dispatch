/* global window */
class GoogleStaticMap extends tabris.ImageView {
	setLocation(location) {
		this.image = {
			src: `https://maps.googleapis.com/maps/api/staticmap?size=${this.width}x${this.height}&scale=${window.devicePixelRatio}&markers=${location}&zoom=15`,
			height: this.height,
			width: this.width,
		};
		return this;
	}
}

module.exports = GoogleStaticMap;
