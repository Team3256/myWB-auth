
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const btoa = require('btoa');
const app = express();

const config = require("./config.json");

const redirect = encodeURIComponent(config.redirect);

app.listen(8082, () => {
    console.info('Running on port 8082');
});

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/auth/discord', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${config.redirect}&response_type=code&scope=identify%20guilds%20guilds.join`);
});

app.get('/api/auth/discord/callback', async (req, res) => {
    console.log(req.query);
    if (req.query.code != null) {
        const code = req.query.code;
        const creds = btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`);
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${config.redirect}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${creds}`,
                },
            });
        const json = await response.json();
        res.redirect(`/?token=${json.access_token}`);
    }
    res.redirect(`/?token=NO_CODE_PROVIDED`);
});