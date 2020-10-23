const router = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const { SerializadorFornecedor } = require('../../Serializador');


router.get('/', async (req, res) => {
  const resultados = await TabelaFornecedor.listar()
  res.status(200)
  const serializador = new SerializadorFornecedor(
    res.getHeader('Content-Type')
  )
  res.send(
    serializador.serializar(resultados)
  )
})

router.post('/', async (req, res, next) => {
  
  try{
    const dadosRecebidos = req.body
    const fornecedor = new Fornecedor(dadosRecebidos)
    await fornecedor.criar()
    res.status(201)
    const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type')
    )
    res.send(
      serializador.serializar(fornecedor)
    )
  }catch(erro) {
    next(erro)
  }
})

router.get('/:idFornecedor', async (req, res, next) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.carregar()
    res.status(200)
    const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type')
    )
    res.send(
      serializador.serializar(fornecedor)
    )
  }catch(erro) {
    next(erro)
  }
})

router.put('/:idFornecedor', async (req, res, next) => {
  try {
    const id = req.params.idFornecedor;
    const dadosRecebidos = req.body
    const dados = Object.assign({}, dadosRecebidos, { id: id })
    const fornecedor = new Fornecedor(dados)
    await fornecedor.atualizar()
    res.status(204)
    res.end()
  }catch(erro) {
    next(erro)
  }
})

router.delete('/:idFornecedor', async (req, res, next) => {
  try {
    const id = req.params.idFornecedor
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.carregar()
    await fornecedor.remover()
    res.status(204)
    res.end()
  } catch(erro) {
    next(erro)
  }
})

module.exports = router