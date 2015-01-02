'use strict';

var testee = require('../../../../../../../../controllers/api/user/contact/index');
var contact = require('./../../../../../../../../models/contact/contact');
var validation = require('./../../../../../../../../lib/jsonValidation');
var request = require('../../../util/request');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/user/profile/contact/index', function () {

    var sandbox,
        checkInvalidPostRequest = function (request) {
            var stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(contact, 'addContact').returns(Promise.reject({}));
            return request.executePostRequest(request.req, request.res).then(function () {
                expect(stubResponse.withArgs(400).calledOnce).to.be.true;
                expect(stubResponse.calledOnce).to.be.true;
            });
        }

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        testee(request.requestMock);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Contact ID is missing - Return a 400', function () {

        request.req.body = {
            mode: 'addContact'
        };

        return checkInvalidPostRequest(request);
    });

    it('Mode is missing - Return a 400', function () {

        request.req.body = {
            contactIds: ['sdef']
        };

        return checkInvalidPostRequest(request);
    });

    it('Mode has wrong name - Return a 400', function () {

        request.req.body = {
            contactIds: ['asdfadf'],
            mode: 'addContact2'
        };

        return checkInvalidPostRequest(request);
    });


    it('Contact ID is only empty string - Return a 400', function () {

        request.req.body = {
            contactIds: [' '],
            mode: 'addContact'
        };

        return checkInvalidPostRequest(request);
    });

    it('Contact ID is to long - Return a 400', function () {

        request.req.body = {
            contactIds: ['abzkeaet54abzkeaet54abzkeaet541'],
            mode: 'addContact'
        };

        return checkInvalidPostRequest(request);
    });

    it('Description is to long - Return a 400', function () {

        request.req.body = {
            contactIds: ['abzkeaet54abzkeaet54abzkeaet54'],
            mode: 'addContact',
            description: 'abzkeaet54abzkeaet54abzkeaet541'
        };

        return checkInvalidPostRequest(request);
    });

    it('Description is empty string- Return a 400', function () {

        request.req.body = {
            contactIds: ['abzkeaet54abzkeaet54abzkeaet54'],
            mode: 'addContact',
            description: '  '
        };

        return checkInvalidPostRequest(request);
    });

    it('Error occurred while adding a connection request - Return a 500', function () {

        request.req.body = {
            contactIds: ['12seefegbh12seefegbh12seefegbh'],
            mode: 'addContact'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contact, 'addContact').returns(Promise.reject({}));

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

    it('Error occurred while getting all contacts - Return a 500', function () {

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contact, 'getContacts').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

    it('Unknown mode causes error (should never happen) - Return a 500', function () {

        request.req.body = {
            contactIds: ['12seefegbh12seefegbh12'],
            mode: 'addContact2'
        };

        var stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contact, 'addContact').returns(Promise.reject({}));
        sandbox.stub(validation, 'validateRequest').returns(Promise.resolve(request));

        return request.executePostRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });
});
