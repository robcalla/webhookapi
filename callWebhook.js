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

app.post('/test-api/webhook', async (req, res) => {
    const webhook = req.body;

    console.log(req.headers)
    console.log(webhook);
    webhooks.push(webhook);

    eVitaResponse = await callEvita(webhook.intent.query);
    
    res.send(eVitaResponse);

});

async function callEvita(talk) {

    //const testUrl = "https://evita-test.opsilab.it/api/devices/send_data?deviceId=636249c7cbd19b5628c98deb&deviceToken=57fdde32-4e4f-4199-ba2f-34e3fe1c9991"

    const evitaUrl = "https://manager.evita.digital-enabler.eng.it/api/devices/send_data?deviceId=62cffa7ee50c9d08f994ec5f&deviceToken=4cd34f81-26cf-4b62-bf64-df9f251982db"

    const config = {
        method: 'post',
        url: evitaUrl,
        headers: { 'Content-Type': 'application/json' },
        data:JSON.stringify({"message": talk})
    }

    let res = await axios(config);

    console.log(res.data);

    let textResponse = "";
    res.data.forEach(x=>{
        if(x['text']!=undefined)
            textResponse+=x['text']+" ";
    })

    let output={
            "prompt": {
                "override": false,
                "firstSimple": {
                    "speech": textResponse,
                    "text": textResponse
                },
            }
        
    }

    return  output;
}

app.get('/test-api/webhooks', (req, res) => {
    res.json(webhooks);
});

app.listen(port, () => console.log(`Webhook app listening on port ${port}!`));
