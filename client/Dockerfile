FROM node:11.8-alpine

ADD yarn.lock /app/yarn.lock
ADD package.json /app/package.json

ENV NODE_PATH=/app/node_modules
ENV PATH=$PATH:/app/node_modules/.bin
ENV API_HOST=api

RUN cd /app && yarn

WORKDIR /app
ADD . /app

EXPOSE 3000

CMD ["yarn", "start"]
