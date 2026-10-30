const { Router } = require('express');
const pedidosController = require('../controllers/pedidosControllers');

const router = Router();

router.post('/', (req, res, next) => pedidosController.criar(req, res, next));
router.get('/', (req, res, next) => pedidosController.listar(req, res, next));
router.get('/:id', (req, res, next) => pedidosController.buscarPorId(req, res, next));
router.patch('/:id/status', (req, res, next) => pedidosController.atualizarStatus(req, res, next));

module.exports = router;