'use strict';

let testee = require('../../../../../../../api/api/login/index');
let request = require('../../../request');
let passport = require('passport');
let loginUser = require('../../../../../../../models/user/loginUser');
let Promise = require('bluebird').Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test api/api/login/index', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Successfully login a user - Return a 200', function (done) {

        testee(request.requestMock);
        let stubResponse = sandbox.stub(request.res, 'status'),
            stubPassport = sandbox.stub(passport, 'authenticate'),
            stubLogin = sandbox.stub(request.req, 'logIn'),
            stubLoginUser = sandbox.stub(loginUser, 'setTimestamp');

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
        stubResponse.returns({
            end: function () {
                expect(stubResponse.withArgs(200).calledOnce).to.be.true;
                done();
            }
        });
    });

    it('Error is caused when setting the timestamp - Return a 200', function (done) {

        testee(request.requestMock);
        let stubResponse = sandbox.stub(request.res, 'status'),
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
        let stubResponse = sandbox.stub(request.res, 'status'),
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
        let stubResponse = sandbox.stub(request.res, 'status'),
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
