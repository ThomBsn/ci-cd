FROM node:20-alpine

WORKDIR /app

ENV HUSKY=0

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
