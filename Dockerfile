# Usa una imagen ligera de Node.js
FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que configuraste en tu .env (ej. 3000)
EXPOSE 3000

# Comando para desarrollo con recarga automática
CMD ["pnpm", "run", "dev:local"]