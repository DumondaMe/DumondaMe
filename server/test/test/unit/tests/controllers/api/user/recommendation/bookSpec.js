'use strict';

var testee = require('../../../../../../../../controllers/api/user/profile/recommendation/book');
var recommendation = require('./../../../../../../../../models/recommendation/recommendation');
var user = require('../../../../../../../../models/user/user');
var request = require('../../../util/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/profile/recommendation/book', function () {

    var sandbox,
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

    it('Add a new valid book recommendation - Return update recommendations', function () {

        var mockResponse = sandbox.mock(request.res);
        request.req.body = {
            title: 'Ein neues Buch',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'Super Buch'
        };
        mockResponse.expects('json').withArgs({id: 'test'});
        sandbox.stub(recommendation, 'saveRecommendation').returns(Promise.resolve({_id: 'test'}));

        return request.executePostRequest(request.req, request.res).then(function () {
            mockResponse.verify();
        });
    });

    it('Title is missing - Return a 400', function () {

        request.req.body = {
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'irgendwas'
        };

        return checkInvalidPostRequest(request);
    });


    it('Rating is missing - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Buch',
            author: 'Roger Waldvogel',
            category: 'book',
            comment: 'irgendwas'
        };

        return checkInvalidPostRequest(request);
    });

    it('Rating is not a boolean - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Buch',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: 'true',
            comment: 'irgendwas'
        };

        return checkInvalidPostRequest(request);
    });

    it('Author is missing for book - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Buch',
            author: undefined,
            category: 'book',
            ratingPositive: true,
            comment: 'irgendwas'
        };

        return checkInvalidPostRequest(request);
    });

    it('Comment is longer than 500 Signs - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Buch',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'aedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtaedfekeörtq'
        };

        return checkInvalidPostRequest(request);
    });

    it('Title is longer than 50 Signs - Return a 400', function () {

        request.req.body = {
            title: 'aedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöed',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'irgendwas'
        };

        return checkInvalidPostRequest(request);
    });

    it('Author is longer than 150 Signs - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Buch',
            author: 'aedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöed',
            category: 'book',
            ratingPositive: true,
            comment: 'irgendwas'
        };

        return checkInvalidPostRequest(request);
    });

    it('PreviousAuthor is to long - Return a 400', function () {

        request.req.body = {
            previousTitle: 'Ein neues Buch',
            title: 'Ein neues Buch',
            previousAuthor: 'aedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöed',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'Super Buch'
        };

        return checkInvalidPostRequest(request);
    });

    it('PreviousAuthor is empty - Return a 400', function () {

        request.req.body = {
            previousTitle: 'Ein neues Buch',
            title: 'Ein neues Buch',
            previousAuthor: ' ',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'Super Buch'
        };

        return checkInvalidPostRequest(request);
    });

    it('PreviousTitle is to long - Return a 400', function () {

        request.req.body = {
            previousTitle: 'aedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöeaedfekeoöed',
            title: 'Ein neues Buch',
            previousAuthor: 'Ein neues Buch',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'Super Buch'
        };

        return checkInvalidPostRequest(request);
    });

    it('PreviousTitle is empty - Return a 400', function () {

        request.req.body = {
            previousTitle: ' ',
            title: 'Ein neues Buch',
            previousAuthor: 'Ein neues Buch',
            author: 'Roger Waldvogel',
            category: 'book',
            ratingPositive: true,
            comment: 'Super Buch'
        };

        return checkInvalidPostRequest(request);
    });

    it('Valid book recommendation delete request - Return a 200', function () {

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

    it('Delete request id is to long - Return a 400', function () {

        request.req.body = {
            id: 'asefgrtgvgasefgrtgvgasefgrtgvgasefgrtgvgasefgrtgvgw'
        };

        return checkInvalidDeleteRequest(request);
    });

    it('Delete request is author missing - Return a 400', function () {

        request.req.body = {
            title: 'Ein neues Buch'
        };

        return checkInvalidDeleteRequest(request);
    });
});