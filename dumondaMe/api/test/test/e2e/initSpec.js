'use strict';

let app = require('../../../../server');
let dbConfig = require('dumonda-me-server-lib').databaseConfig;
let dumondaMeTestUtil = require('dumonda-me-server-test-util');

dumondaMeTestUtil.init(require('dumonda-me-server-lib'), app);

dumondaMeTestUtil.stubCDN().stub(require('dumonda-me-server-lib').cdn);
dumondaMeTestUtil.stubLimitRate();
dumondaMeTestUtil.stubRecaptcha.stub(require('../../../models/util/recaptcha'));

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
