'use strict';

let app = require('../../../server');
let dbConfig = require('elyoos-server-lib').databaseConfig;
let elyoosTestUtil = require('elyoos-server-test-util');
let sinon = require('sinon');
let sandbox = sinon.sandbox.create();

elyoosTestUtil.init(require('elyoos-server-lib'), app);

elyoosTestUtil.stubCDN().stub(require('elyoos-server-lib').cdn);
elyoosTestUtil.stubEmailQueue();
elyoosTestUtil.stubLimitRate();
elyoosTestUtil.stubRecaptcha.stub(require('../../../models/util/recaptcha'));

let stubGeoCode = sandbox.stub(require('elyoos-server-lib').geocodingConfig, 'getConfig');
stubGeoCode.returns({secret:'e0a0c78a5098a52778cc8c5d51f63049'});

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
