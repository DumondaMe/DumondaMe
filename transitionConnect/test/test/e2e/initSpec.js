'use strict';

let app = require('../../../server');
let dbConfig = require('dumonda-me-server-lib').databaseConfig;
let elyoosTestUtil = require('elyoos-server-test-util');

elyoosTestUtil.init(require('dumonda-me-server-lib'), app, 'tc');

elyoosTestUtil.stubLimitRate();

let chai = require('chai');
let chaiSubset = require('chai-subset');
chai.use(chaiSubset);
chai.should();

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
