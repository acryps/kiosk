#!/usr/bin/env node

const puppeteer = require('puppeteer');
const os = require('os');
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
console.log(`launching browser on '${location}' as '${os.userInfo().username}' attached to :${port}`);

// launch browser
const browserProcess = task.spawn(puppeteer.executablePath(), [
	'--kiosk', 
	'--disable-infobars',
	`--remote-debugging-port=${port}`
]);

browserProcess.on('spawn', () => {
	console.log(`attaching to browser...`);

	puppeteer.launch({
		browserURL: `http://localhost:${port}`
	}).then(async browser => {
		const page = await browser.newPage();
	
		// add clear screen
		await page.goto('about:blank');
		await page.evaluate('document.body.style.background = "grey"');
	
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
});