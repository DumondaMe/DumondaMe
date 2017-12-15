FROM node:8.9.3

ARG node_env='production'
ARG elyoos_mode='production'

ENV NODE_ENV $node_env
ENV ELYOOS_MODE $elyoos_mode

COPY GraphicsMagick-1.3.25.tar.gz /tmp

RUN cd /tmp && tar -xvf GraphicsMagick-1.3.25.tar.gz && cd /tmp/GraphicsMagick-1.3.25 && ./configure && make && make install && cd / && rm -r /tmp/*

RUN mkdir -p /usr/src/app/server
COPY node_modules /usr/src/app/server/node_modules

WORKDIR /usr/src/app/server

RUN mkdir -p /usr/src/app/server/config

RUN mkdir -p /usr/src/app/client/app/dist
RUN mkdir -p /usr/src/app/client/app/lib/jquery
RUN mkdir -p /usr/src/app/client/app/lib/imageCrop
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
COPY server/config/production.json /usr/src/app/server/config/production.json
COPY server/config/production.json /usr/src/app/server/config/development.json

#Copy client files
COPY client/app/dist /usr/src/app/client/app/dist
COPY client/app/img /usr/src/app/client/app/img
COPY client/app/lib/jquery/jquery.min.js /usr/src/app/client/app/lib/jquery
COPY client/app/lib/imageCrop/cropper.min.js /usr/src/app/client/app/lib/imageCrop
COPY client/app/lib/map/leaflet.js /usr/src/app/client/app/lib/map
COPY client/app/lib/map/leaflet.css /usr/src/app/client/app/lib/map
COPY client/app/lib/map/images /usr/src/app/client/app/lib/map/images
COPY client/app/lib/moment/moment.js /usr/src/app/client/app/lib/moment
COPY client/app/lib/angularMaterial/angular-material.1.1.4.min.js /usr/src/app/client/app/lib/angularMaterial
COPY client/app/lib/angularMaterial/angular-material.1.1.4.min.css /usr/src/app/client/app/lib/angularMaterial
COPY client/app/sass/app.css /usr/src/app/client/app/sass
COPY client/app/sass/app.css.map /usr/src/app/client/app/sass
COPY client/app/sass/common.css /usr/src/app/client/app/sass
COPY client/app/sass/common.css.map /usr/src/app/client/app/sass
COPY client/app/sass/googleFont.css /usr/src/app/client/app/sass
COPY client/app/index.html /usr/src/app/client/app
COPY client/app/indexAuth.html /usr/src/app/client/app
COPY client/app/indexPreview.html /usr/src/app/client/app

EXPOSE 8080
CMD [ "npm", "start" ]