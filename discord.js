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
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) {
    res.redirect(`http://localhost:8080/#/register/discord?token=NO_CODE_PROVIDED`);
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
  res.redirect(`http://localhost:8080/#/register/discord?token=${json.access_token}`);
}));

module.exports = router;