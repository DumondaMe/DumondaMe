'use strict';

var testee = require('../../../../../controllers/index');
var validation = require('./../../../../../../common/src/lib/jsonValidation');
var request = require('./../../../../../../common/test/unit/request');
var moment = require('moment');
var crypto = require('./../../../../../../common/src/lib/crypto');
var cdn = require('./../../../../../../common/src/lib/cdn');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var sinon = require('sinon');
var expect = require('chai').expect;
var path = require('path');

describe('Unit Test controllers/index', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Sending back the requested file', function () {

        var now = moment.utc().valueOf() + 2000, stubSendfile;

        testee(request.requestMock);

        request.req.query.expires = now.toString();
        request.req.query.path = 'test/path/thumbnail.jpg';
        sandbox.stub(crypto, 'decrypt', function (param) {
            return param;
        });
        sandbox.stub(cdn, 'getConfig', function () {
            return {path: 'cdn/'};
        });
        stubSendfile = sandbox.stub(request.res, 'sendFile');

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubSendfile.calledWith(path.join('cdn/', 'test/path/thumbnail.jpg'))).to.be.true;
        });

    });

    it('Time is expired. Sending status code 401', function () {

        var now = moment.utc().valueOf() - 1000,
            stubResponse = sandbox.stub(request.res, 'status', function () {
                return {
                    end: function () {
                    }
                };
            });

        testee(request.requestMock);

        request.req.query.expires = now.toString();
        request.req.query.path = 'test/path/thumbnail.jpg';
        sandbox.stub(crypto, 'decrypt', function (param) {
            return param;
        });

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(401).calledOnce).to.be.true;
        });

    });

    it('Error occurs. Sending status code 500', function () {

        var now = moment.utc().valueOf(),
            stubResponse = sandbox.stub(request.res, 'status', function () {
                return {
                    end: function () {
                    }
                };
            });

        sandbox.stub(validation, 'validateQueryRequest').returns(Promise.reject({}));
        testee(request.requestMock);

        request.req.query.expires = now.toString();
        request.req.query.path = 'test/path/thumbnail.jpg';

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(500).calledOnce).to.be.true;
        });

    });

    it('Path is missing. Sending status code 400', function () {

        var now = moment.utc().valueOf(),
            stubResponse = sandbox.stub(request.res, 'status', function () {
                return {
                    end: function () {
                    }
                };
            });

        testee(request.requestMock);

        request.req.query.expires = now.toString();
        delete request.req.query.path;

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(400).calledOnce).to.be.true;
        });

    });

    it('Expires is missing. Sending status code 400', function () {

        var stubResponse = sandbox.stub(request.res, 'status', function () {
                return {
                    end: function () {
                    }
                };
            });

        testee(request.requestMock);

        delete request.req.query.expires;
        request.req.query.path = 'test/path/thumbnail.jpg';

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(400).calledOnce).to.be.true;
        });

    });

    it('Expires is to long. Sending status code 400', function () {

        var stubResponse = sandbox.stub(request.res, 'status', function () {
            return {
                end: function () {
                }
            };
        });

        testee(request.requestMock);

        request.req.query.expires = '345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556431';
        request.req.query.path = 'test/path/thumbnail.jpg';

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(400).calledOnce).to.be.true;
        });

    });

    it('Path is to long. Sending status code 400', function () {

        var stubResponse = sandbox.stub(request.res, 'status', function () {
            return {
                end: function () {
                }
            };
        });

        testee(request.requestMock);

        request.req.query.expires = '12345';
        request.req.query.path = '345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556433454355643345435564334543556431';

        return request.executeGetRequest(request.req, request.res).then(function () {
            expect(stubResponse.withArgs(400).calledOnce).to.be.true;
        });

    });
});
