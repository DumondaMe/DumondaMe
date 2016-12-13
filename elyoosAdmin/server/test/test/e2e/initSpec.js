'use strict';

global.requireTestUtil = function (name) {
    return require(`${__dirname}/../../../../../elyoos/server/test/test/e2e/tests/util/${name}`);
};

let app = require('../../../server');
let dbConfig = require('elyoos-server-lib').databaseConfig;

requireTestUtil('stubEmailQueue');
requireTestUtil('stubLimitRate');

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
