const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');
const formatosAceitos = require('./Serializador').formatosAceitos;
const { SerializadorErro } = require('./Serializador')

app.use(bodyParser.json());

app.use((req, res, next) => {
  let formatoRequisitado = req.header('Accept')

  if(formatoRequisitado === '*/*') {
    formatoRequisitado = 'application/json'
  }

  if(formatosAceitos.indexOf(formatoRequisitado) === -1) {
    res.status(406)
    res.end()
    return
  }
  res.setHeader('Content-Type', formatoRequisitado)
  next()
})

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

const router = require('./routes/fornecedores');
const NaoEncontrado = require('./error/NaoEncontrado');
const CampoInvalido = require('./error/CampoInvalido');
const DadosNaoFornecidos = require('./error/DadosNaoFornecidos');
const ValorNaoSuportado = require('./error/ValorNaoSuportado');
app.use('/api/fornecedores', router)

const routerV2 = require('./routes/fornecedores/routes.v2');
app.use('/api/v2/fornecedores', routerV2);

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

  const serializador = new SerializadorErro(
    res.getHeader('Content-Type')
  )

  res.status(status)
  res.send(
    serializador.serializar({
      mensagem: erro.message,
      id: erro.idErro
    })
  )
})

app.listen(config.get('api.port'), () => {
  console.log("funcionou.");
})