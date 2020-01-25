
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('./utils.js');
const app = express();

const config = require("./config.json");

const redirect = encodeURIComponent(config.redirect);

app.listen(8082, () => {
    console.info('Running on port 8082');
});

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.use('/api/auth/discord', require('./discord.js'));

app.use((err, req, res, next) => {
    switch (err.message) {
      case 'NoCodeProvided':
        return res.status(400).send({
          status: 'ERROR',
          error: err.message,
        });
      default:
        return res.status(500).send({
          status: 'ERROR',
          error: err.message,
        });
    }
});