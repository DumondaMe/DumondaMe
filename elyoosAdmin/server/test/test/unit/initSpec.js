'use strict';

global.requireDb = function () {
    return require('elyoos-server-lib').neo4j;
};
global.requireModel = function (name) {
    return require(`${__dirname}/models/${name}`);
};

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname + '../../../';
}

var dbConfig = require('elyoos-server-lib').databaseConfig;

describe('Initialize Server Unit Test', function () {

    before(function () {

    });

    it('dummy Test', function (done) {
        dbConfig.config({host: 'http://localhost:7476'}).then(function () {
            done();
        });
    });
});