const express = require('express');
const bodyParser = require('body-parser');
const GNRequest = require('./apis/gerencianet');

const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', 'src/views');

const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET
});

app.get('/', async (req, res) => {
  const reqGN = await reqGNAlready;

  const dataCob = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: '85.00',
    },
    chave: 'e92c9339-1d74-4b1e-a3a9-78203b81da2b',
    solicitacaoPagador: 'Cobrança dos serviços prestados',
  };

  const cobResponse = await reqGN.post('/v2/cob', dataCob);

  const qrCodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

  return res.render('qrcode', { qrCodeImage: qrCodeResponse.data.imagemQrcode });
});

app.get('/cobrancas', async(req, res) => {
  const reqGN = await reqGNAlready;

  const cobrancas = await reqGN.get(
    '/v2/cob?inicio=2021-06-10T16:01:35Z&fim=2021-06-30T20:10:00Z'
  );

  return res.send(cobrancas.data);
});

app.post('/webhook(/pix)?', (req, res) => {
  console.log(req.body);
  res.send('200');
});

app.listen(8000, () => {
  console.log('running');
});
