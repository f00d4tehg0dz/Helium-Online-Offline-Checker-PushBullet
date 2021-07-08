const chalk = require("chalk");
const PushBullet = require('pushbullet');
const moment = require('moment');

// Colorful Logging
const error = chalk.bold.red;
const success = chalk.keyword("green");

// Push Bullet 
const PUSHBULLET_TOKEN = 'o.T16HtwhOBZigduzWSChtLMkWdw7m8mhA';
const PUSHBULLET_CHANNEL = '';

// Fetch api page
let scrape = async () => {
  try {

    // Init pushbullet
    const pusher = new PushBullet(PUSHBULLET_TOKEN);
    const request = require('request');

    // Place your validator address here
    const validatoraddress = '112E9fj7K9P4N4fRnMYjeFVSdFZsdJ9eSS139cmqdCn8L8qKHcc1'

    let url = 'https://api.helium.io/v1/validators/'+validatoraddress;

    let options = {json: true};

    request(url, options, (error, res, body) => {
        if (error) {
            return  console.log(error)
        };

        if (!error && res.statusCode == 200) {
            const obj = body.data.status.online;
            if (obj == 'online'){
              console.log('online')
            } 
            else {
              const timeStr = moment().format('DD/MM/YYYY - hh:mm:ss');
              const title = `[${timeStr}] Helium Offline`;
              pusher.note({channel_tag: PUSHBULLET_CHANNEL}, title, obj, function(error, response) {});
              console.log('pushing - ', timeStr, title, obj);
            }
        };
    });
  } catch (err) {

    // Catch and display errors

    console.log(error(err));
  }
};

// Timer to run every 5 minutes and check
var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("Checking Validator Status every 5 minutes");
  scrape();
}, the_interval);
