'use strict';

var testee = require('../../../../../../../../controllers/api/user/contact/contacting');
var contacting = require('./../../../../../../../../models/contact/contacting');
var validation = require('./../../../../../../../../lib/jsonValidation');
var request = require('../../../../request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/contact/contacting', function () {

    var sandbox,
        checkInvalidGetRequest = function (request) {
            var stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(contacting, 'getContacting').returns(Promise.reject({}));
            return request.executeGetRequest(request.req, request.res).then(function () {
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

    it('itemsPerPage is missing - Return a 400', function () {

        request.req.query = {
            skip: '0'
        };

        return checkInvalidGetRequest(request);
    });

    it('skip is missing - Return a 400', function () {

        request.req.query = {
            itemsPerPage: '5'
        };

        return checkInvalidGetRequest(request);
    });

    it('skip is to small - Return a 400', function () {

        request.req.query = {
            itemsPerPage: '5',
            skip: '-1'
        };

        return checkInvalidGetRequest(request);
    });

    it('itemsPerPage is to small - Return a 400', function () {

        request.req.query = {
            itemsPerPage: '-1',
            skip: '1'
        };

        return checkInvalidGetRequest(request);
    });

    it('itemsPerPage is to big - Return a 400', function () {

        request.req.query = {
            itemsPerPage: '51',
            skip: '1'
        };

        return checkInvalidGetRequest(request);
    });

    it('itemsPerPage is not a number - Return a 400', function () {

        request.req.query = {
            itemsPerPage: 'asb',
            skip: '1'
        };

        return checkInvalidGetRequest(request);
    });

    it('Error occurred while getting contacting- Return a 500', function () {

        request.req.query = {
            itemsPerPage: '5',
            skip: '0'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contacting, 'getContacting').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });
});
