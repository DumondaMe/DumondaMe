FROM node:6.9.1

ENV NODE_ENV 'production'

COPY GraphicsMagick-1.3.25.tar.gz /tmp

RUN cd /tmp && tar -xvf GraphicsMagick-1.3.25.tar.gz && cd /tmp/GraphicsMagick-1.3.25 && ./configure && make && make install && cd / && rm -r /tmp/*

RUN mkdir -p /usr/src/app/server/config

RUN mkdir -p /usr/src/app/client/app/dist
RUN mkdir -p /usr/src/app/client/app/lib/jquery
RUN mkdir -p /usr/src/app/client/app/lib/imageCrop
RUN mkdir -p /usr/src/app/client/app/lib/map
RUN mkdir -p /usr/src/app/client/app/lib/map/images
RUN mkdir -p /usr/src/app/client/app/sass

WORKDIR /usr/src/app/server

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
COPY client/app/lib/imageCrop/cropper.min.js /usr/src/app/client/app/lib/imageCrop
COPY client/app/lib/map/leaflet.js /usr/src/app/client/app/lib/map
COPY client/app/lib/map/leaflet.css /usr/src/app/client/app/lib/map
COPY client/app/sass/app.css /usr/src/app/client/app/sass
COPY client/app/sass/app.css.map /usr/src/app/client/app/sass
COPY client/app/index.html /usr/src/app/client/app

RUN npm install --production
RUN npm install --save ../../commonLib/serverLib

EXPOSE 8080
CMD [ "npm", "start" ]