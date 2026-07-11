# Who's Posting 💬

Bem-vindo ao **Who's Posting**! Este é um projeto Full-Stack desenvolvido como entrega final para o curso da EBAC. A aplicação é uma rede social simples e responsiva onde os usuários podem criar perfis, editar suas informações e compartilhar postagens em um feed global.

---

## 🚀 Links de Deploy (Produção)

- **Frontend (Aplicação Live):** [Link do Vercel - Será adicionado em breve]
- **Backend (API):** [Link do Render - Será adicionado em breve]

---

## 🛠️ Tecnologias Utilizadas

O projeto foi dividido em duas partes principais:

### Frontend
- **React (com Vite):** Construção da interface de forma rápida e otimizada.
- **Tailwind CSS:** Estilização utilitária e responsiva (Mobile First).
- **React Router Dom:** Navegação suave entre páginas (Feed e Perfil).
- **Axios:** Integração e consumo da API REST.

### Backend
- **Python & Django:** Construção robusta e segura da regra de negócio.
- **Django REST Framework (DRF):** Criação rápida e escalável dos endpoints da API.
- **PostgreSQL:** Banco de dados relacional (Produção e Local).

---

## ⚙️ Como rodar o projeto localmente

Para rodar este projeto na sua máquina para avaliação, certifique-se de ter o Node.js, Python e o PostgreSQL instalados.

### 1. Clonando o Repositório
```bash
git clone https://github.com/seu-usuario/whos-posting.git
cd whos-posting
```

### 2. Configurando o Backend
Abra um terminal e acesse a pasta do backend
````bash
cd backend
````
Crie seu ambiente virtual, ative-o e instale as dependências:
````bash
python -m venv env

# Para ativar no Windows:
env\Scripts\activate
# Para ativar no Mac/Linux:
source env/bin/activate

# Instale as dependências
pip install django djangorestframework psycopg2-binary django-cors-headers
````
Rode as migrações e inicie o servidor:
`````bash
python manage.py migrate
python manage.py runserver
`````
### 3. Configurando o Frontend
Abra um novo terminal (mantenha o backend rodando) e acesse a pasta do frontend:
````bash
cd frontend
````
Instale os pacotes e inicie a aplicação:
````bash
npm install
npm run dev
````
O frontend estará acessível em http://localhost:5173 como o próprio terminal informa.
