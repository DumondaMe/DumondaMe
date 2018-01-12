'use strict';

let testee = require('../../../../../../../../api/api/user/settings/uploadProfileImage');
let saveProfileImage  = require('../../../../../../../../models/image/generateProfileImages');
let request = require('../../../../request');
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test api/api/user/settings/uploadProfileImage', function () {

    let sandbox;

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

        let stubResponse = sandbox.stub(request.res, 'status');
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

        let stubResponse = sandbox.stub(request.res, 'status');
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