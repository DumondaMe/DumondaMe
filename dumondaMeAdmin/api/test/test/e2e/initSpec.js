'use strict';

const app = require('../../../../server');
const dbConfig = require('dumonda-me-server-lib').databaseConfig;
const elyoosTestUtil = require('dumonda-me-server-test-util');
require('chai').should();

elyoosTestUtil.init(require('dumonda-me-server-lib'), app);

elyoosTestUtil.stubCDN().stub(require('dumonda-me-server-lib').cdn);
elyoosTestUtil.stubLimitRate();

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
