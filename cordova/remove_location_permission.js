#!/usr/bin/env node
const fs = require('fs');

if(fs.existsSync('platforms/android')) {
	let lines = fs.readFileSync('platforms/android/AndroidManifest.xml', 'utf8').split('\n');
	const MANIFEST = 'platforms/android/AndroidManifest.xml';

	lines.forEach((line, index, object) => {
		if(line.match(/ACCESS_COARSE_LOCATION|ACCESS_FINE_LOCATION/)) {
			object.splice(index, 1);
		}
	});

	fs.writeFileSync(MANIFEST, lines.join('\n'));
}
