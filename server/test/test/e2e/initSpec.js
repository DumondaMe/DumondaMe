'use strict';

var app = require('../../../server');
var dbConfig = require('../../../lib/database');
var cdn = require('../../../models/util/cdn');
var sinon = require('sinon');

var Promise = require('bluebird');

sinon.stub(cdn, 'getUrl').returnsArg(0);
sinon.stub(cdn, 'uploadFile').returns(Promise.resolve());
sinon.stub(cdn, 'copyFile').returns(Promise.resolve());
sinon.stub(cdn, 'createFolderRegisterUser').returns(Promise.resolve());

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
