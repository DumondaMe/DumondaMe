'use strict';

let app = require('../../../server');
let dbConfig = require('elyoos-server-lib').databaseConfig;

require('elyoos-server-test-util').stubEmailQueue;
require('elyoos-server-test-util').stubLimitRate;

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
