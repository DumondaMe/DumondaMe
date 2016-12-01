'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname + '../../../';
}

var dbConfig = require('../../../../../elyoos/server/lib/database');

describe('Initialize Server Unit Test', function () {

    before(function () {

    });

    it('dummy Test', function (done) {
        dbConfig.config({host: 'http://localhost:7476'}).then(function () {
            done();
        });
    });
});