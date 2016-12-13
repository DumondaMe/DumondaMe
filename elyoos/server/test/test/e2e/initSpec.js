'use strict';

global.requireTestUtil = function (name) {
    return require(`${__dirname}/tests/util/${name}`);
};

var app = require('../../../server');
var dbConfig = require('elyoos-server-lib').databaseConfig;
require('./tests/util/stubCDN');
require('./tests/util/stubEmailQueue');
require('./tests/util/stubLimitRate');
require('./tests/util/stubRecaptcha');

describe('Initialize Server for all integration tests', function () {

    before(function (done) {
        app.on('start', function () {
            dbConfig.connected.then(function () {
                done();
            });
        });
    });

    it('dummy Test', function () {
    });
});
