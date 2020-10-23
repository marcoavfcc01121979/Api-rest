const ValorNaoSuportado = require("./error/ValorNaoSuportado")

class Serializador {
  json(dados) {
    return JSON.stringify(dados)
  }

  serializar (dados) {
    if(this.contentType === 'application/json') {
      return this.json(
        this.filtrar(dados)
      )
    }
    throw new ValorNaoSuportado(this.contentType)
  }

  filtrarObjeto (dados) {
    const novoObjeto = {}

    this.camposPublico.forEach((campo) => {
      if(dados.hasOwnProperty(campo)) {
        novoObjeto[campo] = dados[campo]
      }
    })
    return novoObjeto
  }

  filtrar(dados) {
    if(Array.isArray(dados)) {
      dados = dados.map(item => {
        return this.filtrarObjeto(item)
      })
    } else {
      dados = this.filtrarObjeto(dados)
    }
    return dados;
  }
}

class SerializadorFornecedor extends Serializador {
  constructor(contentType) {
    super()
    this.contentType = contentType
    this.camposPublico = [
      'id',
      'empresa',
      'categoria'
    ]
  }
}

module.exports = {
  Serializador: Serializador,
  SerializadorFornecedor: SerializadorFornecedor,
  formatosAceitos: ['application/json']
}