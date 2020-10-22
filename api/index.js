const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');

app.use(bodyParser.json());

const router = require('./routes/fornecedores');
const NaoEncontrado = require('./error/NaoEncontrado');
const CampoInvalido = require('./error/CampoInvalido');
const DadosNaoFornecidos = require('./error/DadosNaoFornecidos');
const ValorNaoSuportado = require('./error/ValorNaoSuportado');
app.use('/api/fornecedores', router)

app.use((erro, req, res, next) => {
  let status = 500

  if(erro instanceof NaoEncontrado) {
    status = 404
  } 

  if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
    status = 400
  }

  if(erro instanceof ValorNaoSuportado) {
    // O status 406 diz que o formato dos dados não é suportado.
    status = 406
  }

  res.status(status)
  res.send(
    JSON.stringify({
      mensagem: erro.message,
      id: erro.idErro
    })
  )
})

app.listen(config.get('api.port'), () => {
  console.log("funcionou.");
})