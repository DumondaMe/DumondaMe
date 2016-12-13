'use strict';

var testee = require('elyoos-server-lib').errors;
var request = require('../../request');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test lib/error/errors', function () {

    var sandbox, next, res;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {

        next = function () {
        };

        res = request.res;

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Test Error Code 401', function () {

        var err = new Error('401'), spyResponse = sandbox.spy(res, 'status');
        testee.handlingError()(err, request.req, res, next);

        expect(spyResponse.calledWith(401)).to.be.true;
    });

    it('Test Error Code 403', function () {

        var err = new Error('403'), spyResponse = sandbox.spy(res, 'status');
        testee.handlingError()(err, request.req, res, next);

        expect(spyResponse.calledWith(403)).to.be.true;
    });

    it('If error code is not handled then return 500', function () {

        var err = new Error('irgenwas'), spyResponse = sandbox.spy(res, 'status');
        testee.handlingError()(err, request.req, res, next);

        expect(spyResponse.calledWith(500)).to.be.true;
    });

    it('If no error occurred call next function', function () {

        var err = {}, spyNext = sandbox.spy();
        testee.handlingError()(err, request.req, res, spyNext);

        expect(spyNext.called).to.be.true;
    });

});
