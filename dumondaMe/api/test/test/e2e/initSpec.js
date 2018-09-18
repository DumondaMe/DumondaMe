'use strict';

let app = require('../../../../server');
let dbConfig = require('dumonda-me-server-lib').databaseConfig;
let elyoosTestUtil = require('dumonda-me-server-test-util');

elyoosTestUtil.init(require('dumonda-me-server-lib'), app);

elyoosTestUtil.stubCDN().stub(require('dumonda-me-server-lib').cdn);
elyoosTestUtil.stubLimitRate();
elyoosTestUtil.stubRecaptcha.stub(require('../../../models/util/recaptcha'));

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
