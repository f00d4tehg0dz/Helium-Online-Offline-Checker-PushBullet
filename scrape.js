const puppeteer = require("puppeteer");
const chalk = require("chalk");
const PushBullet = require('pushbullet');
const moment = require('moment');

// Colorful Logging
const error = chalk.bold.red;
const success = chalk.keyword("green");

// Push Bullet 
const PUSHBULLET_TOKEN = '';
const PUSHBULLET_CHANNEL = '';

// Scrape
let scrape = async () => {
  try {
    // Init pushbullet
    const pusher = new PushBullet(PUSHBULLET_TOKEN);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
    dumpio: false,
    headless: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 1366, height: 768 }) 
    // Enter url in page
    await page.goto(`https://explorer-beta.helium.com/validators`, {timeout: 0, waitUntil: 'networkidle0'});
    await page.screenshot({ path: ('screencap.png') })
    // Memorize old value
    const oldValue = await page.$eval('.font-mono.text-gray-800.text-sm', el => el.innerText);
    // Wait until the .font-mono.text-gray-800.text-sm value changes
    while (oldValue == await page.$eval('.font-mono.text-gray-800.text-sm', el => el.innerText))
    {
        page.waitForTimeout(1000); // Wait for a second
    }
    // Memorize new value
    const newValue = await page.$eval('.font-mono.text-gray-800.text-sm', el => el.innerText);
    // Output them
    console.log("Old value: " + oldValue);
    console.log("New value: " + newValue);
    const timeStr = moment().format('DD/MM/YYYY - hh:mm:ss');
    const title = `[${timeStr}] System Alert`;
    pusher.note({channel_tag: PUSHBULLET_CHANNEL}, title, newValue, function(error, response) {});
    console.log('pushing - ', timeStr, title, newValue);
    // Close browser
    console.log(success("Browser Closed"));
    await browser.close();
    return newValue;
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    console.log(error("Error, Browser Closed"));
  }
};
scrape().then((value) => {
  console.log(value); // Success!
});