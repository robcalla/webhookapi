const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;

const app = express();
const port = 3000;


let webhooks = [];
let eVitaResponse='';

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/test-api/webhook', (req, res) => {
    const webhook = req.body;

    console.log(webhook);
    webhooks.push(webhook);

    eVitaResponse=callEvita(webhook.intent.query);
    
    res.send(eVitaResponse);

});

async function callEvita(talk) {

    const config = {
        method: 'post',
        url: 'https://manager.evita.digital-enabler.eng.it/api/devices/send_data?deviceId=62cffa7ee50c9d08f994ec5f&deviceToken=4cd34f81-26cf-4b62-bf64-df9f251982db',
        headers: { 'Content-Type': 'application/json' },
        data:JSON.stringify({"message": talk})
    }

    let res = await axios(config);

    console.log(res.data);

    return  res.data;
}

app.get('/test-api/webhooks', (req, res) => {
    res.json(webhooks);
});

app.listen(port, () => console.log(`Webhook app listening on port ${port}!`));