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

require('elyoos-server-test-util').init(require('elyoos-server-lib'));

let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let Promise = require('bluebird');
let dbConfig = require('elyoos-server-lib').databaseConfig;
Promise.promisifyAll(require('gm').prototype);

let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe('Initialize Server Unit Test', function () {

    before(function () {
        stubEmailQueue.clear();
    });

    it('dummy Test', function (done) {
        dbConfig.config({host: 'bolt://localhost:7688'}).then(function () {
            done();
        });
    });
});