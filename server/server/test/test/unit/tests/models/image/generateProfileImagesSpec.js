'use strict';

var testee = require('../../../../../../models/image/generateProfileImages');
var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var gm = require('./../../../../../../models/util/gm');
var mkdirp = require('mkdirp');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test models/image/generateProfileImages', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Generate the profileImages', function () {

        var stubGm = sandbox.stub(gm, 'gm');

        stubGm.returns({
            thumbAsync: function () {
                return Promise.resolve();
            }
        });

        sandbox.stub(mkdirp, 'sync');

        return testee.generateProfileImage('test', '2');

    });

});
