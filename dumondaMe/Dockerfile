FROM node:8.9.4

ENV NODE_ENV 'production'
ENV PORT 3000

RUN mkdir -p /usr/src/app/server/.nuxt
RUN mkdir -p /usr/src/app/server/api/api
RUN mkdir -p /usr/src/app/server/api/models
RUN mkdir -p /usr/src/app/server/serverLib
RUN mkdir -p /usr/src/app/server/node_modules
RUN mkdir -p /usr/src/app/server/config

COPY docker_node_modules/serverLib /usr/src/app/server/serverLib
COPY docker_node_modules/node_modules /usr/src/app/server/node_modules

WORKDIR /usr/src/app/server

COPY .nuxt /usr/src/app/server/.nuxt
COPY api/api /usr/src/app/server/api/api
COPY api/models /usr/src/app/server/api/models
COPY config /usr/src/app/server/config
COPY nuxt.config.js /usr/src/app/server/nuxt.config.js
COPY server.js /usr/src/app/server/server.js
COPY originalPackage.json /usr/src/app/server/package.json

USER node

EXPOSE 3000
CMD [ "npm", "start" ]