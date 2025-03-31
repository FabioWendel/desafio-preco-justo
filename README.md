# Desafio Preço Justo 🧠💸

Este projeto é um CRUD de Posts e Comentários em Angular, usando a API pública [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com), com gerenciamento in-memory, dark mode, Tailwind CSS.

## ✅ Funcionalidades

- CRUD completo de posts
- CRUD completo de comentários (por post)
- Edição local se o post/comentário for criado pelo usuário
- Feedback visual com toasts e modais de confirmação
- Dark Mode com toggle
- Loading spinner
- Responsive + Mobile-ready
- Componentes reativos com FormBuilder
- Uso de environment para configurar API
- Docker ready 🐳

---

## 🚀 Tecnologias

- Angular (standalone)
- Tailwind CSS
- Lucide Angular (ícones)
- RxJS
- Docker + NGINX (produção)

---

## 🧪 Como rodar localmente

### Pré-requisitos

- Node.js (v18+ recomendado)
- Angular CLI
- Docker (opcional para build final)

### Clonar Projeto

```bash

git clone https://github.com/FabioWendel/desafio-preco-justo.git

```

```bash

cd desafio-preco-justo

```

### Rodando Local sem Docker & Instalar dependências

```bash

npm install

```

```bash

ng serve

```

- Acesse no navegador:
📍  http://localhost:4200/posts


## 🐳 Rodando com Docker

- Faça o build da imagem Docker
````bash

    docker build -t desafio-preco-justo .

````
- Rode o container
````bash

    docker run -d -p 8080:80 desafio-preco-justo

````
- Acesse no navegador:
📍 http://localhost:8080/posts
