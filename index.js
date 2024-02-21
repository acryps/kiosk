#!/usr/bin/env node

const puppeteer = require('puppeteer');
const os = require('os');

const location = process.argv[2];

// check if a url is set
if (!location) {
	throw new Error('No kiosk URL provided');
}

// check if the url is valid
new URL(location);

console.log(`opening kiosk for '${location}' as '${os.userInfo().username}'`);

// launch browser
puppeteer.launch({
	headless: false,
	args: [
		'--kiosk', 
		'--start-fullscreen',
		'--disable-infobars'
	]
}).then(async browser => {
	const page = await browser.newPage();

	// get screen size
	await page.goto('about:blank');
	await page.evaluate('document.body.style.background = "grey"');

	const width = await page.evaluate('screen.width');
	const height = await page.evaluate('screen.height');

	// apply viewport size
	page.setViewport({ width, height });

	const reload = async () => {
		try {
			const response = await page.goto(location);

			if (response.status() < 200 || response.status() >= 300) {
				console.warn(`could not load, page returned status code '${response.status()}'`);

				return setTimeout(() => reload(), 5000);
			}
		} catch (error) {
			console.warn(`could not load: '${error}'`);

			return setTimeout(() => reload(), 5000);
		}

		console.log('loaded page');
	};

	console.log('loading page...');
	reload();
});