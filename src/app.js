const express = require('express');
const pedidosRoutes = require('./routes/pedidosRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API de Gerenciamento de Pedidos em execução.',
    versao: '1.0.0',
    documentacao: 'Consulte o README.md para especificações e testes dos endpoints.',
  });
});

app.use('/pedidos', pedidosRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: `Rota ${req.method} ${req.originalUrl} não foi encontrada.`,
  });
});


app.use(errorHandler);

module.exports = app;