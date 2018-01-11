'use strict';

let testee = require('../../../../../../../controllers/api/user/userInfo');
let user = require('./../../../../../../../models/user/user');
let request = require('../../../request');
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test controllers/api/user/userInfo', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        testee(request.requestMock);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Error occurred while getting user Info - Return a 500', function () {

        let stubResponse = sandbox.stub(request.res, 'status');
        stubResponse.returns({
            end: function () {
            }
        });
        sandbox.stub(user, 'getUserInfo').returns(Promise.reject({}));

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });
    });

});
