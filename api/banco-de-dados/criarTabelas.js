const ModeloTabela = require('../routes/fornecedores/ModeloTabelFornecedore');

ModeloTabela
  .sync()
  .then(() => console.log('Tabela criada com sucesso'))
  .catch(console.log())