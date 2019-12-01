'use strict';

require('dumonda-me-server-lib').init('emailService');
require('chai').should();

const dbConfig = require('dumonda-me-server-lib').databaseConfig;
const dumondaMeTestUtil = require('dumonda-me-server-test-util');

dumondaMeTestUtil.init(require('dumonda-me-server-lib'));
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

dumondaMeTestUtil.stubCDN().stub(require('dumonda-me-server-lib').cdn);

global.requireSrc = function (name) {
    return require(`${__dirname}/../src/${name}`);
};

global.requireDb = function () {
    return require('dumonda-me-server-lib').neo4j;
};

require(`${__dirname}/../src/locales`).init();

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
