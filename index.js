#!/usr/bin/env node

const puppeteer = require('puppeteer');

const location = process.argv[2];

// check if a url is set
if (!location) {
	throw new Error('No kiosk URL provided');
}

// check if the url is valid
new URL(location);

console.log(`opening kiosk for '${location}'`);

puppeteer.launch({
	headless: false,
	args: [
		'--kiosk', 
		'--disable-infobars'
	]
}).then(async browser => {
	const page = await browser.newPage();

	// Using CDP to hide the automation banner
	const cdpSession = await page.createCDPSession();
	await cdpSession.send('Page.addScriptToEvaluateOnNewDocument', {
		source: `Object.defineProperty(navigator, 'webdriver', {get: () => undefined})`
	});
	
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