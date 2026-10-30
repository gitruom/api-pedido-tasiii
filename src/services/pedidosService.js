const pedidosRepository = require('../repositories/pedidosRepositories');
const AppError = require('../errors/AppError');

const TIPOS_VALIDOS = ['entrega', 'retirada'];
const PRIORIDADES_VALIDAS = ['baixa', 'normal', 'alta', 'urgente'];
const STATUS_VALIDOS = ['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'];

// Mapeamento de transições de status válidas
const TRANSICOES_PERMITIDAS = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: [],
};

class PedidosService {
  criarPedido(dados) {
    const { cliente, tipo, valor, prioridade } = dados || {};

    if (typeof cliente !== 'string' || cliente.trim().length === 0) {
      throw new AppError('O campo "cliente" é obrigatório e deve ser um texto não vazio.', 400);
    }

    if (typeof tipo !== 'string' || !TIPOS_VALIDOS.includes(tipo.trim().toLowerCase())) {
      throw new AppError(
        `O campo "tipo" é inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}.`,
        400
      );
    }

    if (typeof valor !== 'number' || isNaN(valor) || valor <= 0) {
      throw new AppError('O campo "valor" é obrigatório, deve ser numérico e maior que zero.', 400);
    }


    if (
      typeof prioridade !== 'string' ||
      !PRIORIDADES_VALIDAS.includes(prioridade.trim().toLowerCase())
    ) {
      throw new AppError(
        `O campo "prioridade" é inválido. Valores aceitos: ${PRIORIDADES_VALIDAS.join(', ')}.`,
        400
      );
    }

    const pedidoParaSalvar = {
      cliente: cliente.trim(),
      tipo: tipo.trim().toLowerCase(),
      valor: Number(valor.toFixed(2)),
      prioridade: prioridade.trim().toLowerCase(),
      status: 'recebido',
    };

    return pedidosRepository.criar(pedidoParaSalvar);
  }

  listarPedidos() {
    return pedidosRepository.listarTodos();
  }

  buscarPedidoPorId(idParam) {
    const id = this._validarEConverterId(idParam);
    const pedido = pedidosRepository.buscarPorId(id);

    if (!pedido) {
      throw new AppError(`Pedido com ID ${id} não foi encontrado.`, 404);
    }

    return pedido;
  }

  atualizarStatus(idParam, dadosStatus) {
    const id = this._validarEConverterId(idParam);
    const { status } = dadosStatus || {};

    if (typeof status !== 'string' || !STATUS_VALIDOS.includes(status.trim().toLowerCase())) {
      throw new AppError(
        `Status inválido. Os status aceitos são: ${STATUS_VALIDOS.join(', ')}.`,
        400
      );
    }

    const novoStatus = status.trim().toLowerCase();
    const pedidoExistente = pedidosRepository.buscarPorId(id);

    if (!pedidoExistente) {
      throw new AppError(`Pedido com ID ${id} não foi encontrado.`, 404);
    }

    const statusAtual = pedidoExistente.status;

    if (statusAtual === novoStatus) {
      throw new AppError(
        `O pedido com ID ${id} já está com o status "${statusAtual}".`,
        400
      );
    }

    const transicoesPermitidas = TRANSICOES_PERMITIDAS[statusAtual] || [];

    if (!transicoesPermitidas.includes(novoStatus)) {
      if (statusAtual === 'entregue' || statusAtual === 'cancelado') {
        throw new AppError(
          `Não é permitido alterar o status de um pedido com status final "${statusAtual}".`,
          400
        );
      }

      throw new AppError(
        `Transição de status inválida: não é permitido alterar de "${statusAtual}" para "${novoStatus}". Transições permitidas a partir de "${statusAtual}": ${transicoesPermitidas.join(', ') || 'nenhuma'}.`,
        400
      );
    }

    return pedidosRepository.atualizarStatus(id, novoStatus);
  }

  _validarEConverterId(idParam) {
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('O identificador (ID) do pedido deve ser um número inteiro positivo.', 400);
    }
    return id;
  }
}

module.exports = new PedidosService();
module.exports.TIPOS_VALIDOS = TIPOS_VALIDOS;
module.exports.PRIORIDADES_VALIDAS = PRIORIDADES_VALIDAS;
module.exports.STATUS_VALIDOS = STATUS_VALIDOS;
module.exports.TRANSICOES_PERMITIDAS = TRANSICOES_PERMITIDAS;