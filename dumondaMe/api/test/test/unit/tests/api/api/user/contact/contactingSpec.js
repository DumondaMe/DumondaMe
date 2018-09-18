/*
'use strict';

let testee = require('../../../../../../../../api/api/user/otherUser/contacting');
let contacting = require('./../../../../../../../../models/contact/contacting');
let request = require('../../../../request');
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test api/api/user/contact/contacting', function () {

    let sandbox,
        checkInvalidGetRequest = function (request) {
            let stubResponse = sandbox.stub(request.res, 'status');
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
            maxItems: '5'
        };

        return checkInvalidGetRequest(request);
    });

    it('skip is to small - Return a 400', function () {

        request.req.query = {
            maxItems: '5',
            skip: '-1'
        };

        return checkInvalidGetRequest(request);
    });

    it('itemsPerPage is to small - Return a 400', function () {

        request.req.query = {
            maxItems: '-1',
            skip: '1'
        };

        return checkInvalidGetRequest(request);
    });

    it('itemsPerPage is to big - Return a 400', function () {

        request.req.query = {
            maxItems: '51',
            skip: '1'
        };

        return checkInvalidGetRequest(request);
    });

    it('itemsPerPage is not a number - Return a 400', function () {

        request.req.query = {
            maxItems: 'asb',
            skip: '1'
        };

        return checkInvalidGetRequest(request);
    });

    it('Error occurred while getting contacting- Return a 500', function () {

        request.req.query = {
            maxItems: '5',
            skip: '0'
        };

        let stubResponse = sandbox.stub(request.res, 'status');
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
*/
