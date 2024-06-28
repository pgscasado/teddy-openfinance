# URL Shortening API

## [Changelog](/CHANGELOG.md)

Esta é uma API de encurtamento de URL desenvolvida em NestJS. A API permite criar URLs encurtadas e redirecionar para as URLs originais. A aplicação pode ser executada localmente ou usando Docker Compose.

Há uma instância desse projeto disponível [aqui](https://url-shortener-pgscasado.fly.dev/).
Especificação Swagger da API está disponível em [/docs](https://url-shortener-pgscasado.fly.dev/).

## Funcionalidades

- **Encurtar URL**: Crie uma URL encurtada a partir de uma URL original.
- **Redirecionar URL**: Redirecione a partir de uma URL encurtada para a URL original.
- **Sistema de usuários**: Você pode criar um usuário e ao encurtar URLs, elas são salvas vinculadas ao seu usuário. Com isso, você pode editar ou apagar suas URLs quando quiser, além de ter a listagem das URLs que você encurtou.

## Requisitos

- Node.js (versão 14 ou superior)
- Docker (opcional)
- Docker Compose (opcional)

## Instalação

### Localmente

1. Clone o repositório:
    ```bash
    git clone https://github.com/pgscasado/teddy-openfinance.git
    cd teddy-openfinance
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Navegue até o serviço de encurtação de URL:
   ```bash
   cd url-shortener-service
   ```

3. Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do serviço e adicione as variáveis necessárias:
    ```env
    DATABASE_URL="file:./dev.db"
    BASE_URL="http://localhost:8000"
    JWT_SECRET="-"
    ```

4. Execute as migrações do banco de dados (se aplicável):
    ```bash
    npx prisma migrate dev
    ```

5. Inicie a aplicação:
    ```bash
    npm run start
    ```

A aplicação estará disponível em `http://localhost:8000`.

### Com Docker Compose

1. Clone o repositório:
    ```bash
    git clone https://github.com/pgscasado/teddy-openfinance.git
    cd teddy-openfinance
    ```

2. Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto e adicione as variáveis necessárias:
    ```env
    DATABASE_URL="file:./dev.db"
    BASE_URL="http://localhost:8000"
    JWT_SECRET="-"
    ```

3. Execute a aplicação com Docker Compose:
    ```bash
    docker-compose up
    ```

A aplicação estará disponível em `http://localhost:8000`. 

- Também é possível rodar a API atrás de um gateway. Rode o seguinte comando para rodar o Krakend junto da API.
    ```bash
    docker-compose up --profile api_gateway up
    ```


## Endpoints

### Encurtar URL

**POST /urls**

- **Descrição**: Cria uma URL encurtada.
- **Corpo da Requisição**:
    ```json
    {
        "originalUrl": "https://exemplo.com"
    }
    ```
- **Resposta**:
    ```json
    {
        "url": "http://localhost:3000/abc123"
    }
    ```

### Redirecionar URL

**GET /:shortUrl**

- **Descrição**: Redireciona para a URL original a partir da URL encurtada.
- **Parâmetros**:
    - `shortUrl`: A URL encurtada.
- **Resposta**: Redireciona para a URL original.

## Testes

Para rodar os testes, utilize o comando:

```bash
npm run test
