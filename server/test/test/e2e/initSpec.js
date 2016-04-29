'use strict';

var app = require('../../../server');
var dbConfig = require('../../../lib/database');
require('./tests/util/stubCDN');
require('./tests/util/stubEmailQueue');

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
