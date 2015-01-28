'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname + '../../../';
}
global.requireLogger = require(__dirname + '/../../../lib/logging');

require('./../../../lib/jsonValidation');

var Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);

describe('Initialize Server Unit Test', function () {

    it('dummy Test', function (done) {
        done();
    });
});