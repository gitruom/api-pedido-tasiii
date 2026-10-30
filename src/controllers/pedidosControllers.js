const pedidosService = require('../services/pedidosService');

class PedidosController {
  criar(req, res, next) {
    try {
      const novoPedido = pedidosService.criarPedido(req.body);
      return res.status(201).json(novoPedido);
    } catch (error) {
      return next(error);
    }
  }

  listar(req, res, next) {
    try {
      const pedidos = pedidosService.listarPedidos();
      return res.status(200).json(pedidos);
    } catch (error) {
      return next(error);
    }
  }

  buscarPorId(req, res, next) {
    try {
      const pedido = pedidosService.buscarPedidoPorId(req.params.id);
      return res.status(200).json(pedido);
    } catch (error) {
      return next(error);
    }
  }

  atualizarStatus(req, res, next) {
    try {
      const pedidoAtualizado = pedidosService.atualizarStatus(req.params.id, req.body);
      return res.status(200).json(pedidoAtualizado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PedidosController();