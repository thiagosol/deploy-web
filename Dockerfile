# 1️⃣ Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.json /app/

RUN npm install

COPY src /app/src
COPY public /app/public

RUN npm run build

# 2️⃣ Runtime Stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
