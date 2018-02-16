'use strict';

let testee = require('../../../../../../../../api/api/user/contact/search');
let searchUser = require('./../../../../../../../../models/user/searchUser');
let request = require('../../../../request');
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test api/api/user/contact/search', function () {

    let sandbox,
        checkInvalidGetRequest = function (request) {
            let stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(searchUser, 'searchUsers').returns(Promise.reject({}));

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

    it('Search is missing - Return a 400', function () {

        request.req.query = {
            maxItems: 5,
            isSuggestion: false
        };

        return checkInvalidGetRequest(request);
    });


    it('Search is only empty string - Return a 400', function () {

        request.req.query = {
            search: ' ',
            maxItems: 5,
            isSuggestion: false
        };

        return checkInvalidGetRequest(request);
    });

    it('Search is to long- Return a 400', function () {

        request.req.query = {
            search: '12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh12seefegbh1',
            maxItems: 5,
            isSuggestion: false
        };

        return checkInvalidGetRequest(request);
    });

    it('Max Items is missing- Return a 400', function () {

        request.req.query = {
            search: '12seefegbh12seefegbh12seefegbh',
            isSuggestion: false
        };

        return checkInvalidGetRequest(request);
    });

    it('Max Items has to small number- Return a 400', function () {

        request.req.query = {
            search: '12seefegbh12seefegbh12seefegbh',
            maxItems: 0,
            isSuggestion: false
        };

        return checkInvalidGetRequest(request);
    });

    it('Max Items has to big number- Return a 400', function () {

        request.req.query = {
            search: '12seefegbh12seefegbh12seefegbh',
            maxItems: 51,
            isSuggestion: false
        };

        return checkInvalidGetRequest(request);
    });

    it('Error occurred while searching users - Return a 500', function () {

        request.req.query = {
            search: '12seefegbh12seefegbh12seefegbh',
            maxItems: 5,
            isSuggestion: false
        };

        let stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(searchUser, 'searchUsers').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });
});