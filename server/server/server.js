'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}
global.requireLogger = require(__dirname + '/lib/logging');

require('./lib/jsonValidation');
var Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);

var kraken = require('kraken-js');
var app = require('express')();
var options = require('./lib/spec')(app);
var logger = requireLogger.getLogger(__filename);
var port = process.env.PORT || 8080;

app.use(kraken(options));

app.listen(port, function (err) {
    if (err) {
        logger.fatal('Server failed to start', {message: err});
    } else {
        logger.info('[' + app.settings.env + '] Listening on http://localhost:' + port);
    }
});

module.exports = app;


