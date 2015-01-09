'use strict';

var testee = require('../../../../../../../../controllers/api/user/settings/profile');
var user = require('../../../../../../../../models/user/user');
var recommendation = require('../../../../../../../../models/recommendation/recommendation');
var request = require('../../../util/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/profile/index', function () {

    var sandbox,
        checkInvalidPostRequest = function (request) {
            var stubResponse = sandbox.stub(request.res, 'status');
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

        var userProfile = {
            name: 'Roger Waldvogel'
        }, spyResponse = sandbox.spy(request.res.status(), 'json');
        spyResponse.withArgs(userProfile);

        sandbox.stub(user, 'getUserProfile').returns(Promise.resolve(userProfile));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(spyResponse.withArgs(userProfile).calledOnce).to.be.true;
        });
    });

    it('Request the user profile data but error occurs- Return 500', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
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
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post missing forename - Return a 400', function () {
        request.req.body = {
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post forename with more then 30 signs- Return a 400', function () {
        request.req.body = {
            forename: 'asdfgghjklöqqwertiopmasdflkjadf',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post empty surname - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: '',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post missing surname - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post surname with more then 50 signs- Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'asdfgghjklöqqwertiopmasdflkjadfpoihtzruztredertghzq',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post wrong birthday format - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-28-28',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post missing birthday - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            country: 'Schweiz',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post empty country - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: '',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post missing country - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post country with more then 50 signs - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'asdfgghjklöqqwertiopmasdflkjadfpoihtzruztredertghzq',
            female: true
        };

        return checkInvalidPostRequest(request);
    });

    it('Post female in wrong format - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: 'efk'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post female is missing - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post street with more then 80 Signs - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true,
            street: 'asdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzh2'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post place with more then 80 Signs - Return a 400', function () {
        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true,
            place: 'asdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzhasdfegrtzh2'
        };

        return checkInvalidPostRequest(request);
    });

    it('Post valid new user profile data - Return a 200', function () {

        request.req.body = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true,
            street: 'Main Street',
            place: 'Urdorf'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
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
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true,
            street: 'Main Street',
            place: 'Urdorf'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
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