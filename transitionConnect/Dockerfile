FROM node:8.9.1

ARG node_env='production'
ARG elyoos_mode='production'

ENV NODE_ENV $node_env
ENV ELYOOS_MODE $elyoos_mode

COPY serverLib /tmp/serverLib

RUN mkdir -p /usr/src/app/server/src
RUN mkdir -p /usr/src/app/server/config

WORKDIR /usr/src/app/server

COPY package*.json /usr/src/app/server
COPY server.js /usr/src/app/server
COPY config/production.json /usr/src/app/server/config/production.json
COPY config/production.json /usr/src/app/server/config/development.json
COPY src /usr/src/app/server/src

RUN chown -R node:node /usr/src/app

USER node

RUN npm install --only=production
RUN npm install /tmp/serverLib --no-save

EXPOSE 8084
CMD [ "npm", "start" ]