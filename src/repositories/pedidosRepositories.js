class PedidosRepository {
  constructor() {
    this.pedidos = [];
    this.currentId = 1;
  }

  criar(dadosPedido) {
    const novoPedido = {
      id: this.currentId++,
      ...dadosPedido,
    };
    this.pedidos.push(novoPedido);
    return { ...novoPedido };
  }

  listarTodos() {
    return this.pedidos.map(p => ({ ...p }));
  }

  buscarPorId(id) {
    const pedido = this.pedidos.find(p => p.id === id);
    return pedido ? { ...pedido } : null;
  }

  atualizarStatus(id, novoStatus) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }
    this.pedidos[index].status = novoStatus;
    return { ...this.pedidos[index] };
  }

  // Método auxiliar para resetar o estado em testes automatizados
  reset() {
    this.pedidos = [];
    this.currentId = 1;
  }
}

// Exportamos uma única instância (Singleton) para persistência em memória durante o ciclo da aplicação
module.exports = new PedidosRepository();