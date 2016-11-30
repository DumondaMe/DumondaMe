'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname + '../../../';
}
global.requireLogger = require(__dirname + '/../../../lib/logging');

require('./../../../lib/jsonValidation');

var stubEmailQueue = require('./../e2e/tests/util/stubEmailQueue');
var Promise = require('bluebird');
var dbConfig = require('../../../lib/database');
Promise.promisifyAll(require('gm').prototype);

describe('Initialize Server Unit Test', function () {

    before(function () {
        stubEmailQueue.clear();
    });

    it('dummy Test', function (done) {
        dbConfig.config({host: 'http://localhost:7476'}).then(function () {
            done();
        });
    });
});