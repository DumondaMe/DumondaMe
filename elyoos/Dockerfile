FROM node:8.9.4

ARG node_env='production'

ENV NODE_ENV $node_env
ENV PORT 8080

RUN mkdir -p /usr/src/app/server
COPY docker_node_modules/node_modules /usr/src/app/server/node_modules

WORKDIR /usr/src/app/server

COPY * /usr/src/app/server/

USER node

EXPOSE 8080
CMD [ "npm", "start" ]