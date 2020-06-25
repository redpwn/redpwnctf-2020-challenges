FROM node:10

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production 

COPY . .

ENV NODE_ENV production

RUN sed -i 's/\[REDACTED\]/flag{tr4v3rsal_Tim3}/g' index.js

USER node

CMD ["node", "/app/index.js"]

EXPOSE 3000
