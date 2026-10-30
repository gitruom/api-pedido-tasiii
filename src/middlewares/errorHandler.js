const AppError = require('../errors/AppError');

function errorHandler(err, req, res, next) {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Formato JSON inválido no corpo da requisição.',
    });
  }

  console.error('Erro inesperado capturado:', err);
  return res.status(500).json({
    error: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
  });
}

module.exports = errorHandler;