#!/usr/bin/env node

const puppeteer = require('puppeteer');
const os = require('os');
const task = require('child_process');
const net = require('net');

const location = process.argv[2];

// check if a url is set
if (!location) {
	throw new Error('No kiosk URL provided');
}

// check if the url is valid
new URL(location);

// find port
const port = 21222;
console.log(`launching browser on '${location}' as '${os.userInfo().username}' attached to :${port}`);

// launch browser
const browserProcess = task.spawn(puppeteer.executablePath(), [
	// kisok options
	'--kiosk',
	'--disable-pinch',
	
	// disable popups
	'--no-first-run',
	'--no-default-browser-check',
	
	// puppeteer connection
	`--remote-debugging-port=${port}`,
	
	'about:blank'
]);

console.log(`attaching to browser...`);

// wait for puppeteer to connect to browser
const connect = () => new Promise(async done => {
	try {
		const browser = await puppeteer.connect({
			browserURL: `http://127.0.0.1:${port}`
		});

		done(browser);
	} catch (error) {
		console.warn(`could not attach: ${error}, retrying...`);

		setTimeout(() => connect().then(browser => done(browser)), 1000);
	}
});

connect().then(async browser => {
	const page = (await browser.pages())[0];

	// add clear screen
	await page.goto('about:blank');
	await page.evaluate('document.body.style.background = "grey"');

	// get screen size
	const width = await page.evaluate('screen.width');
	const height = await page.evaluate('screen.height');

	// apply viewport size
	page.setViewport({ width, height });

	const reload = async () => {
		try {
			const response = await page.goto(location);

			if (response.status() < 200 || response.status() >= 400) {
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
