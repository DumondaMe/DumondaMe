'use strict';

const app = require('../../../../server');
const dbConfig = require('elyoos-server-lib').databaseConfig;
const elyoosTestUtil = require('elyoos-server-test-util');
require('chai').should();

elyoosTestUtil.init(require('elyoos-server-lib'), app);

elyoosTestUtil.stubCDN().stub(require('elyoos-server-lib').cdn);
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
