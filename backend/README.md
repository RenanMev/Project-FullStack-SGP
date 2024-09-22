# Documentação da API: Projetos

## Endpoints

### 1. Listar Todos os Projetos
**`GET /api/projetos`**

Retorna todos os projetos cadastrados.

**Respostas:**
- `200 OK`: Lista de projetos.
- `404 Not Found`: Nenhum projeto encontrado.
- `500 Internal Server Error`: Erro ao listar projetos.

---

### 2. Obter Projeto por ID
**`GET /api/projetos/:id`**

Retorna um projeto específico com base no ID.

**Parâmetros:**
- `id`: Identificador do projeto.

**Respostas:**
- `200 OK`: Detalhes do projeto.
- `404 Not Found`: Projeto não encontrado.
- `500 Internal Server Error`: Erro ao buscar projeto.

---

### 3. Cadastrar Novo Projeto
**`POST /api/projetos`**

Cadastra um novo projeto.

**Corpo da Requisição:**
```json
{
  "nome": "string",
  "descricao": "string",
  "data_inicio": "string",
  "data_fim": "string",
  "status": "string",
  "prioridade": "string"
}
```

**Respostas:**
- `201 Created`: Projeto cadastrado com sucesso.
- `400 Bad Request`: Nome, data_inicio e status são obrigatórios.

---

### 4. Editar Projeto
**`PUT /api/projetos/:id`**

Edita um projeto existente.

**Parâmetros:**
- `id`: Identificador do projeto.

**Corpo da Requisição:**
```json
{
  "nome": "string",
  "descricao": "string",
  "data_inicio": "string",
  "data_fim": "string",
  "status": "string",
  "prioridade": "string"
}
```

**Respostas:**
- `200 OK`: Projeto atualizado.
- `400 Bad Request`: Erros de validação.
- `404 Not Found`: Projeto não encontrado.

---

### 5. Deletar Projeto
**`DELETE /api/projetos/:id`**

Remove um projeto.

**Parâmetros:**
- `id`: Identificador do projeto.

**Respostas:**
- `204 No Content`: Projeto removido com sucesso.
- `404 Not Found`: Projeto não encontrado.

---

### 6. Listar Usuários de um Projeto
**`GET /api/projetos/:projetoId/usuarios`**

Retorna os usuários associados a um projeto.

**Parâmetros:**
- `projetoId`: Identificador do projeto.

**Respostas:**
- `200 OK`: Lista de usuários do projeto.
- `404 Not Found`: Projeto não encontrado.

---

### 7. Adicionar Usuário a um Projeto
**`POST /api/projetos/:projetoId/usuarios`**

Adiciona um usuário a um projeto.

**Parâmetros:**
- `projetoId`: Identificador do projeto.

**Corpo da Requisição:**
```json
{
  "usuario_id": "number"
}
```

**Respostas:**
- `201 Created`: Usuário adicionado ao projeto.
- `404 Not Found`: Projeto ou usuário não encontrado.
- `400 Bad Request`: Usuário já adicionado.

---

### 8. Remover Usuário de um Projeto
**`DELETE /api/projetos/:projetoId/usuarios/:usuarioId`**

Remove um usuário de um projeto.

**Parâmetros:**
- `projetoId`: Identificador do projeto.
- `usuarioId`: Identificador do usuário.

**Respostas:**
- `204 No Content`: Usuário removido do projeto.
- `404 Not Found`: Projeto ou usuário não encontrado.
- `400 Bad Request`: Usuário não está atribuído ao projeto.

---

### 9. Obter Projetos de um Usuário
**`GET /api/usuarios/:usuarioId/projetos`**

Retorna os projetos associados a um usuário.

**Parâmetros:**
- `usuarioId`: Identificador do usuário.

**Respostas:**
- `200 OK`: Lista de projetos do usuário.
- `404 Not Found`: Nenhum projeto vinculado ao usuário encontrado.

---

### 10. Atualizar Status de um Projeto
**`PATCH /api/projetos/:projetoId/status`**

Atualiza o status de um projeto.

**Parâmetros:**
- `projetoId`: Identificador do projeto.

**Corpo da Requisição:**
```json
{
  "status": "string"
}
```

**Respostas:**
- `200 OK`: Status do projeto atualizado.
- `404 Not Found`: Projeto não encontrado.
- `400 Bad Request`: Status não informado.

---
```
