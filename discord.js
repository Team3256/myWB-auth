const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const config = require("./config.json");
const { catchAsync } = require('./utils');

const router = express.Router();

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const redirect = encodeURIComponent(config.redirect);

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify%20guilds%20guilds.join`);
});

router.get('/callback', catchAsync(async (req, res) => {
  console.log(req.query.code);
  if (!req.query.code) {
    res.redirect(`${config.web_host}/#/register/discord?token=NO_CODE_PROVIDED`);
    return;
  }
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  const json = await response.json();
  console.log(json.access_token);
  res.redirect(`${config.web_host}/#/register/discord?token=${json.access_token}`);
}));

module.exports = router;