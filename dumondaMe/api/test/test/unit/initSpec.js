'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname + '../../../';
}

global.requireDb = function () {
    return require('dumonda-me-server-lib').neo4j;
};

global.requireModel = function (name) {
    return require(`${__dirname}/../../../models/${name}`);
};
require('dumonda-me-server-lib').init('dumondaMe');
require('dumonda-me-server-lib').jsonValidation;

require('dumonda-me-server-test-util').init(require('dumonda-me-server-lib'));

let dbConfig = require('dumonda-me-server-lib').databaseConfig;

let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe('Initialize Server Unit Test', function () {

    it('dummy Test', function () {
        return dbConfig.config({host: 'bolt://localhost:7688'});
    });
});