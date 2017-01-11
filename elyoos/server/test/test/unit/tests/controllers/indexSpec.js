'use strict';

let testee = require('../../../../../controllers/index');
let user = require('../../../../../models/user/user');
let request = require('./../request');
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test controllers/index', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Return the index file with empty username for the cookie', function (done) {


        testee(request.requestMock);
        let stubCookie = sandbox.stub(request.res, 'cookie'),
            stubSendfile = sandbox.stub(request.res, 'sendFile');

        request.executeGetRequest(request.req, request.res);

        expect(stubCookie.withArgs('user', '{"username":""}').calledOnce).to.be.true;
        expect(stubSendfile.calledOnce).to.be.true;
        done();
    });

    it('Return the index file with empty username for the cookie (Only session)', function (done) {

        testee(request.requestMock);
        let stubCookie = sandbox.stub(request.res, 'cookie'),
            stubSendfile = sandbox.stub(request.res, 'sendFile');
        request.req = {session: {}};

        request.executeGetRequest(request.req, request.res);

        expect(stubCookie.withArgs('user', '{"username":""}').calledOnce).to.be.true;
        expect(stubSendfile.calledOnce).to.be.true;
        done();
    });

    it('Return the index file with empty username for the cookie (Only session.passport)', function (done) {

        testee(request.requestMock);
        let stubCookie = sandbox.stub(request.res, 'cookie'),
            stubSendfile = sandbox.stub(request.res, 'sendFile');
        request.req = {session: {passport: {}}};

        request.executeGetRequest(request.req, request.res);

        expect(stubCookie.withArgs('user', '{"username":""}').calledOnce).to.be.true;
        expect(stubSendfile.calledOnce).to.be.true;
        done();
    });

    it('Return the index file with session username for the cookie', function (done) {

        testee(request.requestMock);
        let stubCookie = sandbox.stub(request.res, 'cookie'),
            stubSendfile = sandbox.stub(request.res, 'sendFile');
        request.req = {session: {passport: {user: 'user'}}};

        request.executeGetRequest(request.req, request.res);

        expect(stubCookie.withArgs('user', '{"username":"user"}').calledOnce).to.be.true;
        expect(stubSendfile.calledOnce).to.be.true;
        done();
    });
});
