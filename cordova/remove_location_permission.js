#!/usr/bin/env node
const fs = require('fs');

if(fs.existsSync('platforms/android')) {
	const MANIFEST = 'platforms/android/AndroidManifest.xml';
	let lines = fs.readFileSync(MANIFEST, 'utf8');

	lines = lines.replace(/\s+<uses-permission android:name="android\.permission\.ACCESS_(?:FINE|COARSE)_LOCATION" \/>/g, '');

	fs.writeFileSync(MANIFEST, lines);
}
