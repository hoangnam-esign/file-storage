FROM node:14.16-alpine3.10

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "npm" ]

CMD [ "start" ]