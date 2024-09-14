![Texto alternativo](./Assets/image.png)

Este projeto está dividido em duas partes: **frontend** e **backend**.

## Tecnologias Utilizadas

- **Frontend:**
  - TypeScript
  - React
  - Tailwind CSS
  - Shadcn UI
  - Axios

- **Backend:**
  - Node.js
  - TypeScript
  - Express
  - MySQL2
  - JWT

## Configuração do Banco de Dados

O banco de dados está hospedado na AWS. Para conectar ao banco, você precisará configurar um arquivo `.env` com os seguintes dados:

```
DB_HOST=database-1.cb6ayoocw69o.us-east-2.rds.amazonaws.com
DB_USER=root
DB_PASS=dW5#Tz8r3L!9Qz1V
DB_NAME=fullstacklab
DB_PORT=3306
```

## Como Rodar o Projeto

### Frontend

Para iniciar o frontend, execute o seguinte comando:

```bash
npm run dev
```

### Backend

Para iniciar o backend, execute o seguinte comando:

```bash
npx ts-node src/server.ts
```

---
