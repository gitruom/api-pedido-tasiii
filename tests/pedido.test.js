
const request = require('supertest');
const app = require('../src/app');
const repository = require('../src/repositories/pedidosRepositories');

describe('Testes da API de Pedidos', () => {

    beforeEach(() => {
        repository.reset();
    });

    // =====================================
    // RF01 - CADASTRO DE PEDIDOS
    // =====================================

    test('Deve cadastrar um pedido válido', async () => {
        const resposta = await request(app)
            .post('/pedidos')
            .send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body.cliente).toBe('Carlos Silva');
        expect(resposta.body.status).toBe('recebido');
    });

    test('Deve rejeitar um pedido com dados inválidos', async () => {
        const resposta = await request(app)
            .post('/pedidos')
            .send({
                cliente: '',
                tipo: 'entrega',
                valor: 0,
                prioridade: 'normal'
            });

        expect(resposta.status).toBe(400);
    });

    test('Deve rejeitar um pedido com valor negativo', async () => {
        const resposta = await request(app)
            .post('/pedidos')
            .send({
                cliente: 'Mariana Oliveira',
                tipo: 'entrega',
                valor: -50,
                prioridade: 'normal'
            });

        expect(resposta.status).toBe(400);
    });

    test('Deve rejeitar um pedido com prioridade inválida', async () => {
        const resposta = await request(app)
            .post('/pedidos')
            .send({
                cliente: 'João Souza',
                tipo: 'retirada',
                valor: 100,
                prioridade: 'urgente_demais'
            });

        expect(resposta.status).toBe(400);
    });


    // =====================================
    // RF02 - LISTAGEM DE PEDIDOS
    // =====================================

    test('Deve listar os pedidos cadastrados', async () => {
        await request(app)
            .post('/pedidos')
            .send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

        const resposta = await request(app).get('/pedidos');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveLength(1);
    });

    test('Deve retornar uma lista vazia quando não houver pedidos', async () => {
        const resposta = await request(app).get('/pedidos');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveLength(0);
    });

    test('Deve listar corretamente vários pedidos cadastrados', async () => {
        await request(app).post('/pedidos').send({
            cliente: 'Carlos Silva',
            tipo: 'entrega',
            valor: 350,
            prioridade: 'normal'
        });

        await request(app).post('/pedidos').send({
            cliente: 'Mariana Oliveira',
            tipo: 'retirada',
            valor: 120,
            prioridade: 'alta'
        });

        const resposta = await request(app).get('/pedidos');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveLength(2);
    });


    // =====================================
    // RF03 - CONSULTA POR ID
    // =====================================

    test('Deve retornar 404 ao consultar um pedido inexistente', async () => {
        const resposta = await request(app).get('/pedidos/999');

        expect(resposta.status).toBe(404);
    });

    test('Deve consultar corretamente um pedido existente', async () => {
        const cadastro = await request(app)
            .post('/pedidos')
            .send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

        const resposta = await request(app)
            .get(`/pedidos/${cadastro.body.id}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body.cliente).toBe('Carlos Silva');
    });

    test('Deve retornar 400 ao consultar um ID inválido', async () => {
        const resposta = await request(app).get('/pedidos/abc');

        expect(resposta.status).toBe(400);
    });


    // =====================================
    // RF04 - ATUALIZAÇÃO DE STATUS
    // =====================================

    test('Deve atualizar o status de um pedido', async () => {
        const cadastro = await request(app)
            .post('/pedidos')
            .send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

        const resposta = await request(app)
            .patch(`/pedidos/${cadastro.body.id}/status`)
            .send({
                status: 'em_preparacao'
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body.status).toBe('em_preparacao');
    });

    test('Deve rejeitar uma atualização com status inválido', async () => {
        const cadastro = await request(app)
            .post('/pedidos')
            .send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

        const resposta = await request(app)
            .patch(`/pedidos/${cadastro.body.id}/status`)
            .send({
                status: 'status_inexistente'
            });

        expect(resposta.status).toBe(400);
    });

    test('Deve retornar 404 ao atualizar um pedido inexistente', async () => {
        const resposta = await request(app)
            .patch('/pedidos/999/status')
            .send({
                status: 'cancelado'
            });

        expect(resposta.status).toBe(404);
    });

});
