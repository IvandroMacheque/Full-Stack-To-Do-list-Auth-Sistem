# 🚀 Full Stack Task Manager - Secure Auth & Server-Side Filtering

Aplicação Full Stack para gerenciamento de tarefas com autenticação baseada em **JWT (Access + Refresh Token)**, **filtragem server-side** e **arquitetura modular**. O projeto foi desenvolvido com foco em segurança, organização de código e boas práticas de integração entre frontend e backend.

Diferente de listas de tarefas comuns, este sistema implementa filtragem e busca diretamente no banco de dados, gestão de categorias personalizadas e um fluxo de autenticação robusto com persistência silenciosa de sessão.

---

## 🔗 Links do Projeto
- **Live Demo:** [https://to-do-frontend-ip3s.onrender.com/](https://to-do-frontend-ip3s.onrender.com/)
- **Backend API:** [https://to-do-backend-cjr1.onrender.com](https://to-do-backend-cjr1.onrender.com)

---

## 🧠 Decisões de Arquitetura

### **1. Estratégia de Dual Token (Access + Refresh)**
Optei pelo uso de dois tokens para equilibrar **segurança** e **experiência de usuário**. O Access Token é curto (15 min) para reduzir danos em caso de interceptação, enquanto o Refresh Token fica protegido em um **Cookie HttpOnly**, invisível ao JavaScript, prevenindo ataques XSS.

### **2. Filtragem e Busca no Backend (Server-side)**
Diferente de filtros locais, a lógica de busca e status é processada diretamente no **PostgreSQL**. Essa abordagem prepara o sistema para cenários com grandes volumes de dados: se o usuário tiver 10.000 tarefas, o frontend continuará leve, recebendo apenas os dados necessários processados pelo banco de dados.

### **3. Escolha do Prisma ORM**
Utilizei o Prisma para garantir **Type Safety** e agilidade no desenvolvimento. O sistema de migrations do Prisma permite um controle rigoroso do esquema do banco, enquanto o seu client provê autocomplete, reduzindo a probabilidade de erros em tempo de execução.

### **4. Separação em Controllers e Middlewares**
A estrutura foi organizada com separação de responsabilidades, a lógica de negócio foi isolada em Controllers, enquanto a segurança foi abstraída em Middlewares. Isso torna o código testável, modular e fácil de manter à medida que o sistema cresce.

---

## 🔒 Pontos Técnicos e Segurança

- **Isolamento de Dados (Data Ownership):** Todas as queries ao banco de dados utilizam obrigatoriamente o `userId` extraído do token JWT. Isso impede que o Usuário A acesse ou manipule dados do Usuário B, mesmo que tente forçar IDs via API.
- **UUIDs v4:** Identificadores únicos universais em todas as tabelas, evitando a previsibilidade de IDs sequenciais.
- **Cascade Delete:** Relacionamentos configurados para garantir integridade referencial. Ao excluir uma conta, o banco remove automaticamente todas as dependências, evitando registros órfãos.
- **Tratamento de Erros Centralizado:** Respostas HTTP semânticas (401, 403, 409, 500) para facilitar o debug no frontend e prover mensagens claras ao usuário. E também padronização das respostas em formato JSON para facilitar integração com o frontend.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (Node.js & Express)**
- **Express 5:** Engine de rotas ágil e moderna.
- **Prisma ORM:** Modelagem de dados relacional com Type Safety e Migrations.
- **PostgreSQL (Neon.tech):** Banco de dados relacional na nuvem com Pooling de conexões.
- **JWT (Json Web Token):** Estratégia de Dual-Token (Access + Refresh).
- **Bcrypt:** Algoritmo de hashing para proteção de dados sensíveis.
- **Cookie-parser:** Manipulação de Cookies HttpOnly para segurança contra XSS.

### **Frontend (React & Vite)**
- **React 19:** UI reativa e modular com Custom Hooks.
- **Tailwind CSS 4:** Design system utilitário e responsivo.
- **Framer Motion:** Animações complexas de layout e transições de estado.
- **Sonner:** Sistema de notificações (Toasts) elegantes e dinâmicas.
- **Axios:** Cliente HTTP com interceptadores para gestão automática de tokens.

---

## 🔒 Destaques de Engenharia e Segurança

### **1. Autenticação Híbrida e Persistência de Sessão**
O sistema utiliza um fluxo de segurança avançado:
- **Dual-Token:** Access Token de curta duração armazenado no cliente e Refresh Token de longa duração em um **Cookie HttpOnly**.
- **Renovação do Access Token:** Através de **Axios Interceptors**, o frontend renova o acesso automaticamente caso o token expire, garantindo que o usuário nunca seja interrompido durante o uso.
- **Token Hashing:** Segurança extra com o armazenamento apenas do hash do Refresh Token no banco de dados.

### **2. Server-side Filtering & Search (Busca no Banco)**
Diferente de filtros feitos no navegador, esta aplicação realiza a **filtragem diretamente no PostgreSQL**:
- Cruzamento de múltiplos critérios (Status + Categoria + Pesquisa de Texto) em uma única query Prisma.
- Otimização de performance para grandes volumes de dados.
- Busca *Case-Insensitive* para uma melhor experiência de busca.

### **3. UX de Micro-interações e Estados**
- **Empty States Receptivos:** Mensagens dinâmicas que mudam de acordo com o filtro aplicado.
- **Feedback Visual:** Loading states nos botões para evitar cliques duplicados e Toasts de confirmação para cada ação do CRUD.
- **Edição In-place:** Permite renomear tarefas diretamente na lista sem mudar de página ou abrir modais.

---

## 📋 Principais Funcionalidades
- [x] **Segurança:** Cadastro, Login e Logout real (invalidação de cookie e banco).
- [x] **Dashboard:** Sidebar com filtros inteligentes (Pendentes, Concluídas, Categorias).
- [x] **Gestão:** CRUD completo com edição de título e datas de término.
- [x] **Organização:** Sistema de categorias com cores personalizadas.
- [x] **Busca:** Barra de pesquisa em tempo real integrada ao backend.
- [x] **Perfil:** Menu de usuário com resumo de conta e opção de exclusão total (Cascade Delete).

---

## 🔮 Possíveis Evoluções
- [ ] **Paginação:** Implementação de paginação server-side para melhorar performance em grandes volumes.
- [ ] **Rate Limiting:**  Proteção contra abuso de requisições e brute force.
- [ ] **Testes Automatizados:** Cobertura com Jest para validação de regras de negócio e autenticação.
- [ ] **Dockerização:**  Padronização de ambiente para facilitar deploy e escalabilidade.
- [ ] **Notificações:** Sistema de alertas para prazos de tarefas.

---

## 📂 Estrutura do Projeto

```text
├── server/               # API RESTful
│   ├── controllers/      # Lógica de negócio (Auth, User, Todo, Category)
│   ├── middlewares/      # Validação de JWT e sanitização
│   ├── routes/           # Endpoints públicos e privados
│   ├── prisma/           # Schema relacional e histórico de Migrations
│   └── server.js         # Configurações de CORS, Cookies e Express
├── ui/                   # Frontend SPA
│   ├── src/
│   │   ├── Hooks/        # Lógica desacoplada do visual (Custom Hooks)
│   │   ├── services/     # Instância Axios e lógica de Interceptadores
│   │   └── pages/        # Componentes de interface e estilização Tailwind
```

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

## ✍️ Autor

Desenvolvido por Ivandro Macheque como um projeto de alta complexidade para demonstrar domínio em segurança Web, manipulação de bancos relacionais e desenvolvimento de interfaces resilientes.