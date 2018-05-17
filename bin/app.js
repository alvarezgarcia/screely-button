const fs = require('fs');
const puppeteer = require('puppeteer');

if (!process.env.SCREENSHOT_DIR) {
  throw new Error('SCREENSHOT_DIR no defined');
}

const screenshotsDir = process.env.SCREENSHOT_DIR;
const url = 'https://www.screely.com/';

const width = 1366;
const height = 768;

function getFiles(dir) {
	return new Promise((resolve) => {
		fs.readdir(dir, (err, files) => resolve(files));
	});
}

function sortFiles(files) {
	const promises = files.map(f => 
		new Promise((resolve) => {
			fs.stat(`${screenshotsDir}/${f}`, (err, s) => resolve({name: f, creationTime: s.birthtimeMs}));
		})
	);

	return Promise.all(promises)
		.then(fileCreationTimes => fileCreationTimes.sort((c, n) => n.creationTime - c.creationTime));
}

async function getLastPNG(files) {
	const [lastFile] = await sortFiles(files)
	return lastFile.name;
}

(async () => {
	const files = await getFiles(screenshotsDir);
	const lastPNG = await getLastPNG(files);
	console.log(lastPNG)

	const browser = await puppeteer.launch({
		headless: false,
		args: [
				`--window-size=${width},${height}`
		],
	});

	const page = await browser.newPage();
	await page.setViewport({ width, height })


	await page.goto(url);
	await page.waitForSelector('input[type="file"]', { timeout: 4000 });

	const fileEle = await page.$('input[type="file"]');
	await fileEle.uploadFile(`${screenshotsDir}/${lastPNG}`);
	await page.waitFor(20000);
			
	//await browser.close();
})();
