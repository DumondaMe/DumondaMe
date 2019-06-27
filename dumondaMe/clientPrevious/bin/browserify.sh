#!/bin/sh
browserify_cmd=node_modules/browserify/bin/cmd.js

bin_path=`dirname $0`
pushd $bin_path/.. > /dev/null
mkdir app/dist 2> /dev/null

$browserify_cmd \
  --entry app/modules/app.js \
  --outfile app/dist/app.js \
  --debug \
  --verbose

popd > /dev/null