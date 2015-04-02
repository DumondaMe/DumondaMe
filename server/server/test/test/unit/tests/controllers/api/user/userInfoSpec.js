'use strict';

var testee = require('../../../../../../../controllers/api/user/userInfo');
var user = require('./../../../../../../../models/user/user');
var request = require('../../../request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/userInfo', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        testee(request.requestMock);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Error occurred while getting user Info - Return a 500', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(user, 'getUserName').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

});
