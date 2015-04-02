#!/bin/bash
sudo stop elyoos
BACKUP_DIR=$(date "+%Y%m%d_%H%M%S")
DEPLOY_DIR=../../elyoos

#Create backup and delete old files
mkdir -p ../backup/$BACKUP_DIR
cp -r $DEPLOY_DIR ../backup/$BACKUP_DIR
rm -r $DEPLOY_DIR
mkdir -p $DEPLOY_DIR/client/app/{dist,fonts,img,lib,sass}
mkdir -p $DEPLOY_DIR/client/app/lib/{jquery,imageCrop}
mkdir -p $DEPLOY_DIR/server/config

#Copy server files
cp server/package.json $DEPLOY_DIR/server
cp -r server/controllers $DEPLOY_DIR/server
cp -r server/lib $DEPLOY_DIR/server
cp -r server/models $DEPLOY_DIR/server
cp -r server/neo4j $DEPLOY_DIR/server
cp server/server.js $DEPLOY_DIR/server
cp ../config.json $DEPLOY_DIR/server/config

#Copy client files
cp client/app/dist/app.js $DEPLOY_DIR/client/app/dist
cp -r client/app/fonts $DEPLOY_DIR/client/app
cp -r client/app/img $DEPLOY_DIR/client/app
cp client/app/lib/jquery/jquery.min.js $DEPLOY_DIR/client/app/lib/jquery
cp client/app/lib/imageCrop/cropper.min.js $DEPLOY_DIR/client/app/lib/imageCrop
cp client/app/sass/app.css $DEPLOY_DIR/client/app/sass
cp client/app/sass/bootstrap.min.css $DEPLOY_DIR/client/app/sass
cp client/app/index.html $DEPLOY_DIR/client/app

#Install npm dependencies

cd ../../elyoos/server
npm install --production
cd ../../../deploy/elyoos

sudo start elyoos

