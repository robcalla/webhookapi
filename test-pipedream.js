const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;

const app = express();
const port = 3000;


let webhooks = [];
let URL = 'https://eoxp4obujavc4z0.m.pipedream.net/';
let eVitaResponse='';

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const webhook = req.body;

    console.log(webhook);
    webhooks.push(webhook);

    eVitaResponse=callEvita(webhook);
    
    res.send(eVitaResponse);

});

async function callEvita(talk) {

    const config = {
        method: 'post',
        url: URL,
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({"message": talk})
    }

    let res = await axios(config);

    console.log(res.data);

    return  res.data;
}

app.get('/webhooks', (req, res) => {
    res.json(webhooks);
});

app.listen(port, () => console.log(`Webhook app listening on port ${port}!`));