#!/usr/bin/env node

const puppeteer = require('puppeteer');
const task = require('child_process');

const location = process.argv[2];

// check if a url is set
if (!location) {
	throw new Error('No kiosk URL provided');
}

// check if the url is valid
new URL(location);

// find port
const port = 9000 + Math.floor(20000 * Math.random());

console.log(`launching browser on '${location}' attached to :${port}`);

// launch browser
const browserProcess = task.spawn(puppeteer.executablePath(), [
	'--kiosk', 
	'--disable-infobars',
	`--remote-debugging-port=${port}`
]);

puppeteer.launch({
	browserURL: `http://localhost:${port}`
}).then(async browser => {
	const page = await browser.newPage();

	// get screen size
	await page.goto('about:blank');

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