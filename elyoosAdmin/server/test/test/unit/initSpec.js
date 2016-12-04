'use strict';

global.requireLogger = require(__dirname + '/../../../../../elyoos/server/lib/logging');
global.requireDb = function () {
    return require(__dirname + '/../../../../../elyoos/server/neo4j');
};
global.requireLib = function (name) {
    return require(`${__dirname}/../../../../../elyoos/server/lib/${name}`);
};
global.requireModel = function (name) {
    return require(`${__dirname}/models/${name}`);
};

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