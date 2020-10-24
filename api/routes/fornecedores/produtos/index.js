const { Router } = require('express')
const Tabela = require('./TabelaProduto')

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const produtos = await Tabela.listar(req.params.idFornecedor)
  res.send(
    JSON.stringify(produtos)
  )
})

module.exports = router