'use strict';

var app = require('../../../server');
var db = require('../../../neo4j/index');
var dbConfig = require('../../../lib/database');
var request = require('supertest');

var Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);


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
