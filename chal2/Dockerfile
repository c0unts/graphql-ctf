FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
ENV PORT=4001
CMD ["node", "index.js"]
