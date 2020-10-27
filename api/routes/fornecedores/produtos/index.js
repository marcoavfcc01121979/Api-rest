const { Router } = require('express')
const Tabela = require('./TabelaProduto')

const router = Router({ mergeParams: true })
const Produto = require('./Produto');


router.get('/', async (req, res) => {
  const produtos = await Tabela.listar(req.fornecedor.id)
  res.send(
    JSON.stringify(produtos)
  )
})

router.post('/', async (req, res, next) => {
  try {
    const idFornecedor = req.fornecedor.id
    const corpo = req.body
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });
    const produto = new Produto(dados);
    await produto.criar()
    res.status(201);
    res.send(produto);
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

module.exports = router