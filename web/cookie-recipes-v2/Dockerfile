FROM node:12-buster-slim

COPY package.json yarn.lock /app/
WORKDIR /app

ENV NODE_ENV production
RUN yarn

COPY . .

EXPOSE 3000

CMD ["node", "/app/index.js"]
