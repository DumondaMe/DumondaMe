'use strict';

var testee = require('../../../../../../../../controllers/api/user/settings/privacy');
var privacy = require('../../../../../../../../models/user/privacy');
var request = require('../../../../request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/settings/security/privacy', function () {

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

    it('Request the user privacy settings data- Return 200', function () {

        var privacySettings = {
            test: 'Test'
        }, spyResponse = sandbox.spy(request.res.status(), 'json');
        spyResponse.withArgs(privacySettings);

        sandbox.stub(privacy, 'getPrivacySettings').returns(Promise.resolve(privacySettings));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(spyResponse.withArgs(privacySettings).calledOnce).to.be.true;
        });
    });

    it('Request the user privacy settings  but error occurs- Return 500', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(privacy, 'getPrivacySettings').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
            expect(stubResponse.calledOnce).to.be.true;
        });

    });

    it('Post new privacy settings fails - Return a 500', function () {

        request.req.body = {
            addNewPrivacy: {
                privacyDescription: 'Irgendwas',
                privacySettings: {
                    profileVisible: true,
                    profileDataVisible: true,
                    imageVisible: true,
                    contactsVisible: true
                }
            }
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(privacy, 'addNewPrivacySetting').returns(Promise.reject({}));

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

    it('Delete privacy settings fails - Return a 500', function () {

        request.req.body = {
            privacyDescription: 'Freund',
            newPrivacyDescription: 'Familie'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(privacy, 'deletePrivacySetting').returns(Promise.reject({}));

        return request.executeDeleteRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });
});