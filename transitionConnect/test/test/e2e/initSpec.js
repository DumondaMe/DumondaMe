'use strict';

let app = require('../../../server');
let dbConfig = require('dumonda-me-server-lib').databaseConfig;
let dumondaMeTestUtil = require('dumonda-me-server-test-util');

dumondaMeTestUtil.init(require('dumonda-me-server-lib'), app, 'tc');

dumondaMeTestUtil.stubLimitRate();

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
