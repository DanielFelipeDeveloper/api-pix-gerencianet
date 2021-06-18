const express = require('express');
const GNRequest = require('./apis/gerencianet')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const reqGNAlready = GNRequest();

app.get('/', async (req, res) => {
  const reqGN = await reqGNAlready;

  const dataCob = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: '85.00',
    },
    chave: '5e3f88b4-0d0a-4ef0-b8a5-20ee247cdb4b',
    solicitacaoPagador: 'Cobrança dos serviços prestados',
  };

  const cobResponse = await reqGN.post('/v2/cob', dataCob);

  const qrCodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

  return res.render('qrcode', { qrCodeImage: qrCodeResponse.data.imagemQrcode });
});


app.listen(8000, () => {
  console.log('running');
});
