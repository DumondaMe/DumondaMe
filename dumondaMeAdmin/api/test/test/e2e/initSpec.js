'use strict';

const app = require('../../../../server');
const dbConfig = require('dumonda-me-server-lib').databaseConfig;
const dumondaMeTestUtil = require('dumonda-me-server-test-util');
require('chai').should();

dumondaMeTestUtil.init(require('dumonda-me-server-lib'), app);

dumondaMeTestUtil.stubCDN().stub(require('dumonda-me-server-lib').cdn);
dumondaMeTestUtil.stubLimitRate();

describe('Initialize Server for all integration tests', function () {

    before(function (done) {
        app.on('start', async function () {
            await dbConfig.connected;
            done();
        });
    });

    it('dummy Test', function () {
    });
});
