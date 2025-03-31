# Etapa 1: Build Angular App
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Instala dependências e faz o build
RUN npm install
RUN npm run build --prod

# Etapa 2: Servir com NGINX
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do build do Angular
COPY --from=builder /app/dist/desafio-preco-justo/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
