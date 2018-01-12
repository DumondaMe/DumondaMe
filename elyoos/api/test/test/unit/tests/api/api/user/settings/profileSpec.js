'use strict';

let testee = require('../../../../../../../../api/api/user/settings/profile');
let user = require('../../../../../../../../models/user/user');
let request = require('../../../../request');
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test api/api/user/settings/profile', function () {

    let sandbox,
        checkInvalidPostRequest = function (request) {
            let stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(user, 'updateUserProfile').returns(Promise.reject({}));

            return request.executePostRequest(request.req, request.res).then(function () {
                expect(stubResponse.withArgs(400).calledOnce).to.be.true;
                expect(stubResponse.calledOnce).to.be.true;
            });
        };

    before(function () {
        sandbox = sinon.sandbox.create();
    });
    beforeEach(function () {
        testee(request.requestMock);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Request the user profile data- Return 200', function () {

        let userProfile = {
            name: 'Roger Waldvogel'
        }, spyResponse = sandbox.spy(request.res.status(), 'json');
        spyResponse.withArgs(userProfile);

        sandbox.stub(user, 'getUserProfile').returns(Promise.resolve(userProfile));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(spyResponse.withArgs(userProfile).calledOnce).to.be.true;
        });
    });

    it('Request the user profile data but error occurs- Return 500', function () {

        let stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(user, 'getUserProfile').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
            expect(stubResponse.calledOnce).to.be.true;
        });

    });

    it('Post empty forename - Return a 400', function () {
        request.req.body = {
            forename: '',
            surname: 'surname'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post missing forename - Return a 400', function () {
        request.req.body = {
            surname: 'surname'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post forename with more then 30 signs- Return a 400', function () {
        request.req.body = {
            forename: 'asdfgghjklöqqwertiopmasdflkjadf',
            surname: 'surname',
        };

        return checkInvalidPostRequest(request);
    });

    it('Post empty surname - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: ''
        };

        return checkInvalidPostRequest(request);
    });

    it('Post missing surname - Return a 400', function () {
        request.req.body = {
            forename: 'user'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post surname with more then 50 signs- Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'asdfgghjklöqqwertiopmasdflkjadfpoihtzruztredertghzq'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post valid new user profile data - Return a 200', function () {

        request.req.body = {
            forename: 'user',
            surname: 'surname'
        };

        let stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(user, 'updateUserProfile').returns(Promise.resolve());

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(200).calledOnce).to.be.true;
        });
    });

    it('Post valid new user profile but error occurs - Return a 500', function () {

        request.req.body = {
            forename: 'user',
            surname: 'surname'
        };

        let stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(user, 'updateUserProfile').returns(Promise.reject({}));

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });
});