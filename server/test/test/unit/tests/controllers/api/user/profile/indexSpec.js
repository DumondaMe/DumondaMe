'use strict';

var testee = require('../../../../../../../../controllers/api/user/profile/image/index');
var user = require('../../../../../../../../models/user/user');
var request = require('../../../util/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');


describe('Unit Test controllers/api/user/profile/image/index', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Request a Profile image - Return the image', function () {

        //TODO as soon as the image loading is implemented
    });
});