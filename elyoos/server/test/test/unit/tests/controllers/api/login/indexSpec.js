'use strict';

var testee = require('../../../../../../../controllers/api/login/index');
var request = require('../../../request');
var passport = require('passport');
var modification = require('../../../../../../../models/modification/modification');
var loginUser = require('../../../../../../../models/user/loginUser');
var Promise = require('bluebird').Promise;
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

    it('Successfully login a user - Return a 200', function (done) {

        testee(request.requestMock);
        var stubResponse = sandbox.stub(request.res, 'status'),
            stubPassport = sandbox.stub(passport, 'authenticate'),
            stubLogin = sandbox.stub(request.req, 'logIn'),
            stubLoginUser = sandbox.stub(loginUser, 'setTimestamp'),
            stubModification = sandbox.stub(modification, 'initModificationOnSession', function () {
                stubModification.callArgWith(2, undefined);
                expect(stubResponse.withArgs(200).calledOnce).to.be.true;
                done();
            });

        stubLoginUser.returns(Promise.resolve());
        stubPassport.returns(function () {
        });
        stubResponse.returns({
            json: function () {
            }
        });

        request.executePostRequest(request.req, request.res);
        stubPassport.callArgWith(1, undefined, {});
        stubLogin.callArgWith(1, undefined);
    });

    it('Error is caused when setting the timestamp - Return a 200', function (done) {

        testee(request.requestMock);
        var stubResponse = sandbox.stub(request.res, 'status'),
            stubPassport = sandbox.stub(passport, 'authenticate'),
            stubLogin = sandbox.stub(request.req, 'logIn'),
            stubLoginUser = sandbox.stub(loginUser, 'setTimestamp');

        stubLoginUser.returns(Promise.reject({}));
        stubPassport.returns(function () {

        });
        stubResponse.returns({
            end: function () {
                expect(stubResponse.withArgs(500).calledOnce).to.be.true;
                done();
            }
        });

        request.executePostRequest(request.req, request.res);
        stubPassport.callArgWith(1, undefined, {});
        stubLogin.callArgWith(1, undefined);
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
