'use strict';

let testee = require('../../../../../../../../api/api/user/contact/index');
let contact = require('./../../../../../../../../models/contact/contact');
let validation = require('elyoos-server-lib').jsonValidation;
let request = require('../../../../request');
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test api/api/user/contact/index', function () {

    let sandbox,
        checkInvalidPostRequest = function (request) {
            let stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(contact, 'addContact').returns(Promise.reject({}));
            return request.executePostRequest(request.req, request.res).then(function () {
                expect(stubResponse.withArgs(400).calledOnce).to.be.true;
                expect(stubResponse.calledOnce).to.be.true;
            });
        },
        checkInvalidDeleteRequest = function (request) {
            let stubResponse = sandbox.stub(request.res, 'status');
            stubResponse.returns({
                end: function () {
                }
            });
            sandbox.stub(contact, 'deleteContact').returns(Promise.reject({}));
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
            mode: 'addContact',
            description: 'Test'
        };

        let stubResponse = sandbox.stub(request.res, 'status');
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

        let stubResponse = sandbox.stub(request.res, 'status');

        request.req.query = {
            itemsPerPage: '10',
            skip: '0'
        };
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contact, 'getContactsNormal').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

    it('Error occurred while getting all contacts with type request- Return a 500', function () {

        let stubResponse = sandbox.stub(request.res, 'status');

        request.req.query = {
            itemsPerPage: '10',
            skip: '0',
            types: 'Familie,Sonstwas'
        };
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contact, 'getContactForTypes').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

    it('Unknown mode causes error (should never happen) - Return a 500', function () {

        request.req.body = {
            contactIds: ['12seefegbh12seefegbh12'],
            mode: 'addContact2'
        };

        let stubResponse = sandbox.stub(request.res, 'status');
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

    it('Contact IDs are missing for deleting contacts- Return a 400', function () {

        request.req.body = {};

        return checkInvalidDeleteRequest(request);
    });

    it('A contact ID is to long when deleting contacts- Return a 400', function () {

        request.req.body = {
            contactIds: ['12ewfrtjki12ewfrtjki12ewfrtjki1']
        };

        return checkInvalidDeleteRequest(request);
    });

    it('To many contacts to delete- Return a 400', function () {

        let i;
        request.req.body = {
            contactIds: []
        };
        for (i = 0; i < 31; i = i + 1) {
            request.req.body.contactIds.push(i.toString());
        }

        return checkInvalidDeleteRequest(request);
    });

    it('Error occurred while deleting contacts - Return a 500', function () {

        let stubResponse = sandbox.stub(request.res, 'status');

        request.req.query = {
            contactIds: ['10']
        };
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(contact, 'deleteContact').returns(Promise.reject({}));
        sandbox.stub(validation, 'validateRequest').returns(Promise.resolve(request));

        return request.executeDeleteRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

});
