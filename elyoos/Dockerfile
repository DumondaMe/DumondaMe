FROM node:8.9.4

ENV NODE_ENV 'production'
ENV PORT 3000

RUN mkdir -p /usr/src/app/server
COPY docker_node_modules/node_modules /usr/src/app/server/node_modules

WORKDIR /usr/src/app/server

COPY * /usr/src/app/server/

USER node

EXPOSE 3000
CMD [ "npm", "start" ]