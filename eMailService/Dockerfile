FROM node:10.15.0

ENV NODE_ENV 'production'
ENV PORT 3000

RUN mkdir -p /usr/src/app/server/src
RUN mkdir -p /usr/src/app/server/serverLib
RUN mkdir -p /usr/src/app/server/node_modules

COPY docker_node_modules/serverLib /usr/src/app/server/serverLib
COPY docker_node_modules/node_modules /usr/src/app/server/node_modules

WORKDIR /usr/src/app/server

COPY src /usr/src/app/server/src
COPY server.js /usr/src/app/server/server.js
COPY originalPackage.json /usr/src/app/server/package.json

USER node

EXPOSE 3000
CMD [ "npm", "start" ]