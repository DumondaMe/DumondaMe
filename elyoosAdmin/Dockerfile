FROM node:6.10.1

ENV NODE_ENV 'production'
ENV ELYOOS_MODE 'production-admin'

ADD serverLib /tmp/serverLib
ADD server/package.json /tmp/package.json
RUN cd /tmp && npm install --production && npm install ./serverLib
RUN mkdir -p /usr/src/app/server && cp -a /tmp/node_modules /usr/src/app/server

WORKDIR /usr/src/app/server

RUN mkdir -p /usr/src/app/server/config

RUN mkdir -p /usr/src/app/client/app/dist
RUN mkdir -p /usr/src/app/client/app/lib/jquery
RUN mkdir -p /usr/src/app/client/app/lib/map
RUN mkdir -p /usr/src/app/client/app/lib/map/images
RUN mkdir -p /usr/src/app/client/app/lib/angularMaterial
RUN mkdir -p /usr/src/app/client/app/lib/moment
RUN mkdir -p /usr/src/app/client/app/sass

#Copy server files
COPY server/package.json /usr/src/app/server
COPY server/controllers /usr/src/app/server/controllers
COPY server/models /usr/src/app/server/models
COPY server/server.js /usr/src/app/server
COPY server/config/production.json /usr/src/app/server/config

#Copy client files
COPY client/app/dist /usr/src/app/client/app/dist
COPY client/app/img /usr/src/app/client/app/img
COPY client/app/lib/jquery/jquery.min.js /usr/src/app/client/app/lib/jquery
COPY client/app/lib/map/leaflet.js /usr/src/app/client/app/lib/map
COPY client/app/lib/map/leaflet.css /usr/src/app/client/app/lib/map
COPY client/app/lib/moment/moment.js /usr/src/app/client/app/lib/moment
COPY client/app/lib/angularMaterial/angular-material.1.1.4.min.js /usr/src/app/client/app/lib/angularMaterial
COPY client/app/lib/angularMaterial/angular-material.1.1.4.min.css /usr/src/app/client/app/lib/angularMaterial
COPY client/app/sass/app.css /usr/src/app/client/app/sass
COPY client/app/sass/app.css.map /usr/src/app/client/app/sass
COPY client/app/index.html /usr/src/app/client/app

EXPOSE 8082
CMD [ "npm", "start" ]