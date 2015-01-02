'use strict';

var testee = require('../../../../../../../../controllers/api/user/profile/recommendation/link');
var recommendation = require('./../../../../../../../../models/recommendation/recommendation');
var user = require('../../../../../../../../models/user/user');
var request = require('../../../util/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;


describe('Unit Test controllers/api/user/profile/recommendation/link', function () {

    var sandbox,
        checkValidPostRequest = function (request) {
            var mockResponse = sandbox.mock(request.res),
                response = {_id: 'test'};

            mockResponse.expects('json').withArgs({id: 'test'});
            sandbox.stub(recommendation, 'saveRecommendation').returns(Promise.resolve(response));

            return request.executePostRequest(request.req, request.res).then(function () {
                mockResponse.verify();
            });
        },
        checkInvalidPostRequest = function (request) {
            var stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(recommendation, 'saveRecommendation').returns(Promise.reject({}));

            return request.executePostRequest(request.req, request.res).then(function () {
                expect(stubResponse.withArgs(400).calledOnce).to.be.true;
                expect(stubResponse.calledOnce).to.be.true;
            });
        },
        checkInvalidDeleteRequest = function (request) {
            var stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(recommendation, 'deleteRecommendation').returns(Promise.reject({}));

            return request.executeDeleteRequest(request.req, request.res).then(function () {
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

    it('Add a new valid video recommendation but error occurs - Return 500', function () {
        request.req.body = {
            category: 'video',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(recommendation, 'saveRecommendation').returns(Promise.reject({}));

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
            expect(stubResponse.calledOnce).to.be.true;
        });
    });

    it('Add a new valid video recommendation - Return the id of the recommendation', function () {
        request.req.body = {
            category: 'video',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkValidPostRequest(request);
    });

    it('Add new valid education recommendations - Return a 200', function () {
        request.req.body = {
            category: 'education',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkValidPostRequest(request);
    });

    it('Add new valid seminar recommendations - Return a 200', function () {
        request.req.body = {
            category: 'seminar',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkValidPostRequest(request);
    });

    it('Add new valid praxis recommendations - Return a 200', function () {
        request.req.body = {
            category: 'praxis',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkValidPostRequest(request);
    });

    it('Add new valid miscellaneous recommendations - Return a 200', function () {
        request.req.body = {
            category: 'miscellaneous',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkValidPostRequest(request);
    });

    it('Add exisiting valid miscellaneous recommendations - Return a 200', function () {
        request.req.body = {
            id: 'asdfasdfaf',
            category: 'miscellaneous',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkValidPostRequest(request);
    });

    it('Id is longer than 50 Signs - Return a 400', function () {

        request.req.body = {
            id: 'asdfasdfafasdfasdfafasdfasdfafasdfasdfafasdfasdfaf1',
            category: 'miscellaneous',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Add a new invalid category recommendation - Return a 400', function () {

        request.req.body = {
            category: 'irgendwas',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Title is missing - Return a 400', function () {

        request.req.body = {
            category: 'miscellaneous',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Category is missing - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkInvalidPostRequest(request);
    });

    it('category is empty - Return a 400', function () {

        request.req.body = {
            category: '',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Rating is missing - Return a 400', function () {

        request.req.body = {
            category: 'miscellaneous',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Rating is not a boolean - Return a 400', function () {

        request.req.body = {
            category: 'miscellaneous',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: 'true',
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Comment is longer than 500 Signs - Return a 400', function () {

        request.req.body = {
            category: 'miscellaneous',
            title: 'Ein neues Video',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'aedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtq'
        };

        return checkInvalidPostRequest(request);
    });

    it('Title is longer than 50 Signs - Return a 400', function () {

        request.req.body = {
            category: 'miscellaneous',
            title: 'aedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöed',
            link: 'www.roger.ch/video',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkInvalidPostRequest(request);
    });

    it('link is longer than 500 Signs - Return a 400', function () {

        request.req.body = {
            category: 'video',
            title: 'Ein neues Video',
            link: 'aedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtq',
            ratingPositive: true,
            comment: 'Super Video'
        };
        return checkInvalidPostRequest(request);
    });

    it('link has empty string - Return a 400', function () {
        request.req.body = {
            category: 'video',
            title: 'Ein neues Video',
            link: '   ',
            ratingPositive: true,
            comment: 'Super Video'
        };

        return checkInvalidPostRequest(request);
    });

    it('Valid Link recommendation delete request - Return a 200', function () {

        request.req.body = {
            id: 'asdfvegerf'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(recommendation, 'deleteRecommendation').returns(Promise.resolve());

        return request.executeDeleteRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(200).calledOnce).to.be.true;
        });
    });

    it('Valid Link recommendation delete request but error occurs - Return a 500', function () {

        request.req.body = {
            id: 'asdfvegerf'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(recommendation, 'deleteRecommendation').returns(Promise.reject({}));

        return request.executeDeleteRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

    it('Delete Link is missing - Return a 400', function () {

        request.req.body = {};

        return checkInvalidDeleteRequest(request);
    });

    it('Delete Link is to long - Return a 400', function () {

        request.req.body = {
            id: 'id3rit.dtzid3rit.dtzid3rit.dtzid3rit.dtzid3rit.dtzs'
        };

        return checkInvalidDeleteRequest(request);
    });

    it('Empty Delete Link - Return a 400', function () {

        request.req.body = {
            link: '   '
        };

        return checkInvalidDeleteRequest(request);
    });
});
