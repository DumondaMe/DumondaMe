'use strict';

var testee = require('../../../../../../../../../controllers/api/user/settings/security/visibility');
var visibility = require('../../../../../../../../../models/user/visibility');
var request = require('../../../../../../../../../../common/test/unit/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/settings/security/visibility', function () {

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

    it('Request the user visibility settings data- Return 200', function () {

        var visibilitySettings = {
            test: 'Test'
        }, spyResponse = sandbox.spy(request.res.status(), 'json');
        spyResponse.withArgs(visibilitySettings);

        sandbox.stub(visibility, 'getVisibilitySettings').returns(Promise.resolve(visibilitySettings));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(spyResponse.withArgs(visibilitySettings).calledOnce).to.be.true;
        });
    });

    it('Request the user visibility settings  but error occurs- Return 500', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(visibility, 'getVisibilitySettings').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
            expect(stubResponse.calledOnce).to.be.true;
        });

    });
});