if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');


const cert = fs.readFileSync(
  path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
  pfx: cert,
  passphrase: ''
});

const credentials = Buffer.from(
  `${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`
).toString('base64')

axios({
  method: 'POST',
  url: `${process.env.GN_ENDPOINT}/oauth/token`,
  headers: {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json'
  },
  httpsAgent: agent,
  data: {
    grant_type: 'client_credentials'
  }
}).then(response => {
  const accessToken = response.data?.access_token;

  const reqGN = axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const dataCob = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: '85.00'
    },
    chave: '5e3f88b4-0d0a-4ef0-b8a5-20ee247cdb4b',
    solicitacaoPagador: 'Cobrança dos serviços prestados'
  };

  
  reqGN.post('/v2/cob', dataCob).then(console.log);
});