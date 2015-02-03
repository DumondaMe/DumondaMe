'use strict';

var testee = require('../../../../../../../../common/src/lib/error/errors').handlingError();
var request = require('../../../../../../../../common/test/unit/request');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test for common errors', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('No Error occurred. Call next function without arguments', function () {

        var error = {}, next = function () {
        }, spyNext = sandbox.spy(next);

        testee(error, request.req, request.res, spyNext);

        expect(spyNext.calledOnce).to.be.true;
    });

    it('Unknown Error occurred. Return status code 500', function () {

        var error = new Error(), stubResponse = sandbox.stub(request.res, 'status', function () {
            return {
                send: function () {
                }
            };
        });

        testee(error, request.req, request.res);

        expect(stubResponse.withArgs(500).calledOnce).to.be.true;
    });

    it('Error 401 occurred. Return status code 401', function () {

        var error = new Error(), stubResponse = sandbox.stub(request.res, 'status', function () {
            return {
                send: function () {
                }
            };
        });
        error.message = '401';

        testee(error, request.req, request.res);

        expect(stubResponse.withArgs(401).calledOnce).to.be.true;
    });

    it('Error 403 occurred. Return status code 403', function () {

        var error = new Error(), stubResponse = sandbox.stub(request.res, 'status', function () {
            return {
                send: function () {
                }
            };
        });
        error.message = '403';

        testee(error, request.req, request.res);

        expect(stubResponse.withArgs(403).calledOnce).to.be.true;
    });
});
