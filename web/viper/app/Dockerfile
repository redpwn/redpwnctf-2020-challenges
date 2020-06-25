FROM node:12

RUN mkdir -p /home/ctf/app

WORKDIR /home/ctf/app

COPY ./package.json ./

RUN npm install

COPY ./ ./

RUN chmod +x wait-for-it.sh

CMD [ "./wait-for-it.sh", "redis:6379", "--", "node", "server.js" ]