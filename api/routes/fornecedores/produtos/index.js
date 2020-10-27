const { Router } = require('express')
const Tabela = require('./TabelaProduto')

const router = Router({ mergeParams: true })
const Produto = require('./Produto');
const { SerializadorProduto } = require('../../../Serializador')

router.get('/', async (req, res) => {
  const produtos = await Tabela.listar(req.fornecedor.id)
  const serializador = new SerializadorProduto(
    res.getHeader('Content-Type')
  )
  res.send(
    serializador.serializar(produtos)
  )
})

router.post('/', async (req, res, next) => {
  try {
    const idFornecedor = req.fornecedor.id
    const corpo = req.body
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });
    const produto = new Produto(dados);
    await produto.criar()
    const serializador = new SerializadorProduto(
      res.getHeader('Content-Type')
    )
    res.status(201);
    res.send(
      serializador.serializar(produto)
    );
  }catch(erro) {
    next(erro);
  }
})

router.delete('/:id', async (req, res) => {
  const dados = {
    id: req.params.id,
    fornecedor: req.fornecedor.id
  }

  const produto = new Produto(dados)
  await produto.apagar()
  res.status(204)
  res.end()
})

router.get('/:id', async (req, res, next) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id
    }
  
    const produto = new Produto(dados)
    await produto.carregar()
    const serializador = new SerializadorProduto(
      res.getHeader('Content-Type'),
      ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
    )
    res.send(
      serializador.serializar(produto)
    )
  
  }catch(erro){
    next(erro)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const dados = Object.assign(
      {},
      req.body,
      {
        id: req.params.id,
        fornecedor: req.fornecedor.id
      }
    )
    const produto = new Produto(dados)
    await produto.atualizar()
    res.status(204)
    res.end()
  } catch(erro) {
    next(erro)
  }
})

router.post('/:id/diminuir-estoque', async (req, res, next) => {
  try{
    const produto = new Produto({
      id: req.params.id,
      fornecedor: req.fornecedor.id
    })
    await produto.carregar()
    produto.estoque = produto.estoque - req.body.quantidade
    await produto.diminuirEstoque()
    res.status(204)
    res.end()
  }catch(erro) {
    next(erro)
  }
})

module.exports = router