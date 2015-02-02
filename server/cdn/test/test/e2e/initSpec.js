'use strict';

var app = require('../../../server');
var request = require('supertest');

var Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);


describe('Initialize Server for all integration tests', function () {

    before(function (done) {
        app.on('start', function () {
            done();
        });
    });

    it('dummy Test', function () {
    });
});
