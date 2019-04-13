FROM node:11.8-alpine

ADD yarn.lock /app/yarn.lock
ADD package.json /app/package.json

ENV NODE_PATH=/app/node_modules
ENV PATH=$PATH:/app/node_modules/.bin
ENV MONGO_HOST="mongo"
ENV GRAPH_HOST="graph"
ENV NEO4J_USER="neo4j"

RUN cd /app && yarn

WORKDIR /app
ADD . /app

EXPOSE 5000

CMD ["yarn", "server"]
