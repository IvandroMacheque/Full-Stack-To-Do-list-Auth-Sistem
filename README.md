# 🚀 Full Stack To-Do List & Auth System

Este projeto é uma aplicação completa de gerenciamento de tarefas, desenvolvida com uma arquitetura organizada e modular implementando boas práticas de **segurança**, **persistência de sessão** e **experiência do usuário (UX)**.

O sistema não é apenas uma lista de tarefas, mas uma aplicação full stack estruturada que utiliza o padrão de **Dual-Token (JWT)** para garantir autenticação segura e escalável.

---

## 🔗 Links do Projeto
- **Live Demo:** https://to-do-frontend-ip3s.onrender.com/
- **Backend API:** https://to-do-backend-cjr1.onrender.com

---

## 🛠️ Tecnologias Utilizadas

### **Backend (Node.js & Express)**
- **Express:** Framework web moderno e ágil.
- **Prisma ORM:** Mapeamento objeto-relacional com foco em produtividade e Type Safety.
- **PostgreSQL:** Banco de dados relacional para armazenamento persistente e confiável.
- **JWT (Json Web Token):** Autenticação Stateless utilizando Access e Refresh Tokens.
- **Bcrypt:** Algoritmo de hashing para proteção de senhas e tokens no banco.
- **Cookie-parser:** Gerenciamento de cookies seguros para proteção contra ataques XSS.

### **Frontend (React & Vite)**
- **React:** Biblioteca de interface para construção de componentes reativos.
- **Tailwind CSS:** Estilização utilitária de última geração.
- **Framer Motion:** Biblioteca de animações para transições fluidas de interface.
- **Axios:** Cliente HTTP configurado com interceptadores para gestão de tokens.
- **React Router Dom:** Navegação entre páginas e proteção de rotas privadas.

---

## 🔒 Destaques de Engenharia e Segurança

### **1. Estratégia de Autenticação Baseada em Access e Refresh Tokens**
Diferente de aplicações comuns, este sistema utiliza um fluxo de autenticação híbrido:
- **Access Token:** JWT de curta duração (15 min) para autorizar operações.
- **Refresh Token:** Token de longa duração (7 dias) armazenado em um **Cookie HttpOnly**. Esta técnica impede que scripts maliciosos acessem o token via JavaScript (**Proteção Anti-XSS**).
- **Token Hashing:** O Refresh Token é armazenado no banco de dados apenas como um **Hash (Bcrypt)**. Isso garante que, mesmo em caso de vazamento da base de dados, as sessões dos usuários permaneçam protegidas.

### **2. Gerenciamento automático de sessão com Axios Interceptors**
O frontend conta com interceptadores que monitoram erros de autenticação. Caso um Access Token expire, o sistema pausa a requisição, renova o token silenciosamente via rota `/refresh` e reexecuta a ação original de forma transparente para o usuário.

### **3. Modelagem de Banco de Dados**
- **UUIDs:** Utilização de identificadores únicos universais para IDs de usuários e tarefas, evitando a exposição da volumetria dos dados na URL.
- **Cascade Delete:** Configuração de deleção em cascata via Prisma, garantindo que ao excluir uma conta, todas as dependências (tarefas) sejam removidas, mantendo a integridade referencial.

---

## 📋 Principais Funcionalidades
- [x] **Cadastro e Login:** Sistema completo com tratamento de erros visuais (campos obrigatórios, e-mail inválido, duplicidade).
- [x] **Gestão de Tarefas:** CRUD completo (Create, Read, Update, Delete).
- [x] **Ordenação Inteligente:** Tarefas pendentes no topo e ordenação nominal (A-Z).
- [x] **Segurança de Sessão:** Sistema de Logout que invalida tokens tanto no cliente quanto no servidor.
- [x] **Perfil do Usuário:** Menu de perfil com dados do usuário logado e opção de exclusão permanente de conta.
- [x] **Animações Fluidas:** Lista de tarefas animada com Framer Motion (layout estável ao deletar/reordenar).

---

## 📂 Estrutura do Projeto

```text
├── server/               # Backend API
│   ├── controllers/      # Lógica de negócio e regras de autenticação
│   ├── middlewares/      # Filtros de segurança e validação de tokens
│   ├── routes/           # Definição dos endpoints da API
│   ├── prisma/           # Modelagem de dados e migrations
│   └── server.js         # Inicialização do servidor e middlewares globais
├── ui/                   # Frontend SPA
│   ├── src/
│   │   ├── hooks/        # Custom Hooks para separação de lógica e visual
│   │   ├── services/     # Configuração da instância Axios e Interceptadores
│   │   └── pages/        # Componentes de interface e estilização Tailwind
```

---

## Melhorias Futuras
- Implementação de paginação
- Rate limiting
- Testes automatizados

---

## 🚀 Como Rodar o Projeto
### **1. Clone o repositório**
### **2. Configure o servidor:**
- Acesse `cd server` e instale com `npm install`.
- Crie um arquivo `.env` com sua `DATABASE_URL` e `JWT_SECRET`.
- Execute as migrations: `npx prisma migrate dev`.
- Inicie o servidor: `node server.js`.
### **3. Configure o frontend:**
- Acesse `cd UI` e instale com `npm install`.
- Inicie o desenvolvimento: `npm run dev`.

---

## ✍️ Autor
Projeto desenvolvido para demonstrar competências em desenvolvimento Full Stack, segurança em aplicações web e arquitetura de software moderna.