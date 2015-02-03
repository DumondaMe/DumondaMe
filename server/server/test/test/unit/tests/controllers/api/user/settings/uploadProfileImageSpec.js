'use strict';

var testee = require('../../../../../../../../controllers/api/user/settings/uploadProfileImage');
var saveProfileImage  = require('../../../../../../../../models/image/generateProfileImages');
var request = require('../../../../../../../../../common/test/unit/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/settings/uploadProfileImage', function () {

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

    it('Upload a new profile image - Return 200', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });

        sandbox.stub(saveProfileImage, 'generateProfileImage').returns(Promise.resolve());

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(200).calledOnce).to.be.true;
        });
    });

    it('Error occurs while upload a new profile image - Return 500', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });

        sandbox.stub(saveProfileImage, 'generateProfileImage').returns(Promise.reject({}));

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });
});