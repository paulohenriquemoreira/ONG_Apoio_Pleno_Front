# 💻 Front-end - ONG Apoio Pleno (Interface de Gestão)

![Status](https://img.shields.io/badge/Status-Concluído-green)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Ecosystem-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-DOM-CA4245?logo=react-router&logoColor=white)

Esta é a interface gráfica (Single Page Application) do sistema de gestão da **ONG Apoio Pleno**. Desenvolvido para ser o painel de controle administrativo da instituição, permitindo o gerenciamento visual e intuitivo de beneficiários, estoque de equipamentos médicos, empréstimos solidários e doações.

Este projeto consome a [API RESTful da ONG Apoio Pleno](https://github.com/paulohenriquemoreira/ONG_Apoio_Pleno_API), que está hospedada na nuvem.

---

## 🛠️ Tecnologias Utilizadas

O Front-end foi arquitetado com foco em performance, componentização e estilização utilitária:

* **React (via Vite):** Biblioteca principal para construção da interface de usuário, garantindo um ambiente de desenvolvimento extremamente rápido e builds otimizados.
* **Tailwind CSS (v4):** Framework CSS Utility-First para estilização rápida, responsiva e padronizada direto nas classes (sem necessidade de arquivos CSS gigantes).
* **React Router DOM:** Gerenciamento do mapa de rotas da aplicação (Navegação SPA).
* **Fetch API:** Consumo nativo da API Node.js/SQLite hospedada no Render.
* **Session Storage:** Gerenciamento local de sessão e persistência de dados de login.

---

## 🛡️ Arquitetura e Segurança

Para garantir que dados sensíveis da ONG não fiquem expostos, o sistema implementa o padrão de **Route Guards (Rotas Protegidas)**.

* **PrivateRoute:** Um componente *Middleware* que envolve todas as telas administrativas. Ele intercepta a navegação e verifica a validade do token/sessão do usuário. Se uma pessoa não autenticada tentar acessar rotas como `/dashboard` ou `/beneficiarios` forçando a URL, ela será redirecionada automaticamente para a porta de entrada (Login).
* **Componentização Inteligente:** Utilização de um componente `Layout` global para evitar repetição de código (DRY - Don't Repeat Yourself) na renderização do Menu Lateral (Sidebar) e Topbar.

---

## 📂 Estrutura de Pastas

A organização segue o padrão de mercado para aplicações React escaláveis:

```text
src/
├── assets/             # Imagens, logos e recursos estáticos
├── components/         # Peças reutilizáveis (Layout, Botões, PrivateRoute)
├── pages/              # As telas completas do sistema (Login, Dashboard, etc.)
├── global.css          # Ponto de entrada do Tailwind CSS
├── App.jsx             # Maestro de navegação (Mapa de Rotas)
└── main.jsx            # Ponto de injeção do React no DOM (index.html)
```

**Usuário padrão criado automaticamente:**
```
Email: admin@ong.com.br
Senha: 123456
```

---

## 🔗 Telas Disponíveis no Painel

**/ (Login)**: *Autenticação do administrador.*

**/dashboard**: *Visão geral e atalhos rápidos.*

**/beneficiarios**: *Cadastro e listagem de famílias assistidas.*

**/equipamentos**: *Controle de estoque (Cadeiras de rodas, muletas, etc.).*

**/emprestimos**: *Gestão de comodatos e prazos de devolução.*

**/manutencoes**: *Histórico de reparos dos equipamentos.*

**/doacoes**: *Registro de entrada de mantimentos e equipamentos.*

**/entregas**: *Registro de saída de doações consumíveis para as famílias.*

---

## ▶️ Como Rodar o Projeto Localmente

**1. Pré-requisitos:**

Node.js instalado.

A API do Back-end rodando (seja local ou na nuvem).

**2. Clone o repositório:**

```Bash
git clone https://github.com/paulohenriquemoreira/ONG_Apoio_Pleno_Front

cd ONG_Apoio_Pleno_Front
```

**3. Instale as dependências:**

```Bash
npm install
```
---

**3. Inicie o servidor de desenvolvimento:**

```Bash
npm run dev

🚀 A aplicação estará disponível no seu navegador, geralmente em: http://localhost:5173
```

---

## 👨‍💻 Desenvolvido por
Paulo Henrique Moreira - 2026

*Projeto desenvolvido com foco educacional e impacto social.*
