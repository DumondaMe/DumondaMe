'use strict';

var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var testee = require('../../../../../../../controllers/api/login/index');
var request = require('../../../request');
var passport = require('passport');
var modification = require('../../../../../../../models/modification/modification')
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test controllers/api/login/index', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Successfully login a user - Return a 200', function () {

        testee(request.requestMock);
        var stubResponse = sandbox.stub(request.res, 'status'),
            stubPassport = sandbox.stub(passport, 'authenticate'),
            stubLogin = sandbox.stub(request.req, 'logIn'),
            stubModification = sandbox.stub(modification, 'initModificationOnSession');

        stubPassport.returns(function () {
        });
        stubResponse.returns({
            json: function () {
            }
        });

        request.executePostRequest(request.req, request.res);
        stubPassport.callArgWith(1, undefined, {});
        stubLogin.callArgWith(1, undefined);
        stubModification.callArgWith(2, undefined);
        expect(stubResponse.withArgs(200).calledOnce).to.be.true;
    });

    it('Error authentication of user failed - Return a 500', function () {

        testee(request.requestMock);
        var stubResponse = sandbox.stub(request.res, 'status'),
            stubPassport = sandbox.stub(passport, 'authenticate');

        stubPassport.returns(function () {
        });
        stubResponse.returns({
            end: function () {
            }
        });

        request.executePostRequest(request.req, request.res);
        stubPassport.callArgWith(1, {});
        expect(stubResponse.withArgs(500).calledOnce).to.be.true;
    });

    it('Login of user failed - Return a 500', function () {

        testee(request.requestMock);
        var stubResponse = sandbox.stub(request.res, 'status'),
            stubPassport = sandbox.stub(passport, 'authenticate'),
            stubLogin = sandbox.stub(request.req, 'logIn');

        stubPassport.returns(function () {
        });
        stubResponse.returns({
            end: function () {
            }
        });

        request.executePostRequest(request.req, request.res);
        stubPassport.callArgWith(1, undefined, {});
        stubLogin.callArgWith(1, {});
        expect(stubResponse.withArgs(500).calledOnce).to.be.true;
    });
});
