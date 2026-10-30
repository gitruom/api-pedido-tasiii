# API de Gerenciamento de Pedidos

## 1. Sobre o projeto

Esta API foi desenvolvida utilizando Node.js e Express.js com o objetivo de realizar o gerenciamento de pedidos. O sistema permite cadastrar novos pedidos, consultar pedidos existentes, listar todos os registros e atualizar seus status.

A aplicação implementa validações de dados, tratamento centralizado de erros e regras de negócio para controlar as transições de status dos pedidos.

### Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express.js:** framework para criação da API REST.
- **Jest:** framework para testes automatizados.
- **Supertest:** biblioteca para testes das requisições HTTP.

## 2. Instalação e execução

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Git instalado.

### Clonando o repositório

```bash
git clone https://github.com/gitruom/api-pedido-tasiii.git
```

Entre na pasta do projeto:

```bash
cd api-pedido-tasiii
```

### Instalando as dependências

Execute:

```bash
npm install
```

O comando instalará as dependências necessárias para executar a aplicação e os testes.

### Executando a API

Para iniciar o servidor:

```bash
npm start
```

O servidor será iniciado na porta **3000**.

Acesse:

```text
http://localhost:3000
```

Caso a aplicação esteja funcionando corretamente, será retornada uma mensagem informando que a API está em execução.

### Executando os testes

Para executar os testes automatizados:

```bash
npm test
```

Os testes são executados utilizando Jest e Supertest, com execução sequencial por meio da opção `--runInBand`.

## 3. Rotas disponíveis

A API disponibiliza as seguintes rotas:

| Método HTTP | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando. |
| POST | `/pedidos` | Cadastra um novo pedido. |
| GET | `/pedidos` | Lista todos os pedidos. |
| GET | `/pedidos/:id` | Consulta um pedido pelo ID. |
| PATCH | `/pedidos/:id/status` | Atualiza o status de um pedido. |

### 3.1. Verificar funcionamento

**GET /**

Retorna uma mensagem de confirmação de funcionamento da API.

Resposta esperada (200):

```json
{
  "mensagem": "API de Gerenciamento de Pedidos em execução.",
  "versao": "1.0.0",
  "documentacao": "Consulte o README.md para especificações e testes dos endpoints."
}
```

### 3.2. Cadastrar pedido

**POST /pedidos**

Permite cadastrar um novo pedido.

Exemplo de requisição:

```json
{
  "cliente": "Roberto Carlos",
  "tipo": "entrega",
  "valor": 950,
  "prioridade": "alta"
}
```

Campos obrigatórios:

- `cliente`: nome do cliente, em formato de texto não vazio.
- `tipo`: modalidade do pedido (`entrega` ou `retirada`).
- `valor`: valor numérico maior que zero.
- `prioridade`: prioridade do pedido (`baixa`, `normal`, `alta` ou `urgente`).

Resposta esperada (201):

```json
{
  "id": 1,
  "cliente": "Roberto Carlos",
  "tipo": "entrega",
  "valor": 950,
  "prioridade": "alta",
  "status": "recebido"
}
```

O identificador é gerado automaticamente e todo pedido novo recebe inicialmente o status `recebido`.

### 3.3. Listar pedidos

**GET /pedidos**

Retorna todos os pedidos cadastrados.

Exemplo de resposta (200):

```json
[
  {
    "id": 1,
    "cliente": "Roberto Carlos",
    "tipo": "entrega",
    "valor": 950,
    "prioridade": "alta",
    "status": "recebido"
  }
]
```

Caso não existam pedidos cadastrados, será retornado um array vazio:

```json
[]
```

### 3.4. Consultar pedido por ID

**GET /pedidos/:id**

Permite consultar individualmente um pedido utilizando seu identificador.

Exemplo:

```text
GET /pedidos/1
```

Resposta esperada (200):

```json
{
  "id": 1,
  "cliente": "Roberto Carlos",
  "tipo": "entrega",
  "valor": 950,
  "prioridade": "alta",
  "status": "recebido"
}
```

Possíveis erros:

- `400 Bad Request`: quando o ID informado não é um número inteiro positivo.
- `404 Not Found`: quando o pedido não existe.

### 3.5. Atualizar status do pedido

**PATCH /pedidos/:id/status**

Permite modificar o status de um pedido existente.

Exemplo de requisição:

```text
PATCH /pedidos/1/status
```

Corpo da requisição:

```json
{
  "status": "em_preparacao"
}
```

Resposta esperada (200):

```json
{
  "id": 1,
  "cliente": "Roberto Carlos",
  "tipo": "entrega",
  "valor": 950,
  "prioridade": "alta",
  "status": "em_preparacao"
}
```

A atualização respeita as regras de transição de status implementadas no sistema.

**Status disponíveis:**

- `recebido`
- `em_preparacao`
- `enviado`
- `entregue`
- `cancelado`

**Transições permitidas:**

| Status atual | Próximos status permitidos |
|---|---|
| recebido | em_preparacao, cancelado |
| em_preparacao | enviado, cancelado |
| enviado | entregue |
| entregue | Nenhum |
| cancelado | Nenhum |

Pedidos com status `entregue` ou `cancelado` são considerados finalizados e não podem ter seu status alterado.

Transições não permitidas retornam erro HTTP 400.

## 4. Arquitetura do projeto

O projeto utiliza uma arquitetura em camadas, separando as responsabilidades da aplicação para facilitar a manutenção, organização e evolução do código.

### Estrutura de diretórios

```text
api-pedido-tasiii/
│
├── prints_evidencias/
│
├── src/
│   ├── controllers/
│   │   └── pedidosControllers.js
│   │
│   ├── errors/
│   │   └── appError.js
│   │
│   ├── middlewares/
│   │   └── errorHandler.js
│   │
│   ├── repositories/
│   │   └── pedidosRepositories.js
│   │
│   ├── routes/
│   │   └── pedidosRoutes.js
│   │
│   ├── services/
│   │   └── pedidosService.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── pedido.test.js
│
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidade de cada camada

**Routes**

Responsável por definir os endpoints da API e direcionar as requisições para os métodos correspondentes dos controllers.

**Controllers**

Recebem as requisições HTTP, acionam os serviços responsáveis pela operação e retornam as respostas com seus respectivos códigos de status.

**Services**

Concentram as regras de negócio da aplicação. São responsáveis pelas validações dos dados, verificações de existência dos pedidos e controle das transições de status.

**Repositories**

Responsável pelo armazenamento e manipulação dos pedidos. A implementação atual utiliza um array em memória para armazenar os registros durante a execução da aplicação.

**Middlewares**

Realizam o tratamento centralizado de erros, padronizando as respostas para situações como dados inválidos, rotas inexistentes e falhas internas.

**Errors**

Contém a classe `AppError`, utilizada para representar erros controlados da aplicação com mensagens e códigos HTTP específicos.

**App.js e Server.js**

O arquivo `app.js` configura o Express, registra os middlewares e as rotas. Já o `server.js` inicializa o servidor na porta 3000.

## 5. Padrões implementados

O projeto utiliza alguns padrões de organização e desenvolvimento:

### Arquitetura em camadas

A aplicação separa as responsabilidades entre rotas, controllers, services e repositories, evitando concentrar toda a lógica em um único arquivo.

### Repository Pattern

O padrão Repository é utilizado para isolar as operações de armazenamento e consulta dos pedidos. Dessa forma, a lógica de acesso aos dados fica separada das regras de negócio.

### Singleton

O repositório exporta uma única instância da classe `PedidosRepository`, compartilhada pelos módulos que a utilizam.

Isso permite manter os pedidos armazenados em memória durante o ciclo de execução da aplicação.

### Tratamento centralizado de erros

A classe `AppError` e o middleware `errorHandler` permitem padronizar o tratamento de exceções e retornar respostas adequadas ao cliente.

## 6. Testes automatizados

Os testes foram desenvolvidos utilizando Jest e Supertest, permitindo verificar o comportamento dos endpoints por meio de requisições HTTP.

O arquivo responsável pelos testes é:

```text
tests/pedido.test.js
```

Antes de cada teste, o método `reset()` do repositório é executado para limpar os registros e garantir que os testes sejam independentes.

### Cenários testados

| Funcionalidade | Cenários |
|---|---|
| Cadastro de pedidos | Cadastro válido, dados inválidos, valor negativo e prioridade inválida. |
| Listagem | Listagem de pedidos, lista vazia e múltiplos registros. |
| Consulta por ID | Pedido existente, inexistente e ID inválido. |
| Atualização de status | Atualização válida, status inválido e pedido inexistente. |

Ao todo, o projeto possui **12 testes automatizados**, contemplando os principais requisitos funcionais da API.

Para executar todos os testes:

```bash
npm test
```

## 7. Uso de IA

Foi utilizada inteligência artificial generativa como ferramenta de apoio ao desenvolvimento e à documentação do projeto.

As principais tarefas em que a IA foi utilizada foram:

- Auxílio na organização e documentação da arquitetura da aplicação.
- Apoio na elaboração e revisão de exemplos de requisições e respostas da API.
- Auxílio na identificação e explicação das regras de negócio e validações.
- Elaboração deste README com base na análise dos arquivos do repositório.


