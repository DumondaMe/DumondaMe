'use strict';

require('dumonda-me-server-lib').init('emailService');
const dbConfig = require('dumonda-me-server-lib').databaseConfig;
const dumondaMeTestUtil = require('dumonda-me-server-test-util');

dumondaMeTestUtil.init(require('dumonda-me-server-lib'));
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

dumondaMeTestUtil.stubCDN().stub(require('dumonda-me-server-lib').cdn);

describe('Initialize Server for all integration tests', function () {

    before(function (done) {
        dbConfig.connected.then(async function () {
            done();
        }).catch(function () {
            logger.error(`Failed to connect to database ${process.env.DATABASE_URL}`);
            done(false);
        });
        dbConfig.config({host: process.env.DATABASE_URL});
    });

    it('dummy Test', function () {
    });
});
