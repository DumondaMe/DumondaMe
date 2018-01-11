'use strict';

let testee = require('../../../../../controllers/index');
let request = require('./../request');
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

    it('Return the index file', function (done) {

        testee(request.requestMock);
        let stubSendfile = sandbox.stub(request.res, 'sendFile');

        request.executeGetRequest(request.req, request.res);
        expect(stubSendfile.calledOnce).to.be.true;
        done();
    });
});
