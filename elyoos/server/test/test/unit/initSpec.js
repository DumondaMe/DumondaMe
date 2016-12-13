'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname + '../../../';
}

global.requireDb = function () {
    return require('elyoos-server-lib').neo4j;
};

global.requireModel = function (name) {
    return require(`${__dirname}/../../../models/${name}`);
};

require('elyoos-server-lib').jsonValidation;

var stubEmailQueue = require('./../e2e/tests/util/stubEmailQueue');
var Promise = require('bluebird');
var dbConfig = require('elyoos-server-lib').databaseConfig;
Promise.promisifyAll(require('gm').prototype);

describe('Initialize Server Unit Test', function () {

    before(function () {
        stubEmailQueue.clear();
    });

    it('dummy Test', function (done) {
        dbConfig.config({host: 'http://localhost:7476'}).then(function () {
            done();
        });
    });
});