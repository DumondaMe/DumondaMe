'use strict';

var register = require('../../../app/modules/auth/register')[1];

describe('Tests all Services of the auth', function () {
    var resource;

    beforeEach(function (done) {
        angular.mock.module('ngResource');
        inject(function ($resource) {
            resource = $resource;
            done();
        });
    });

    it('Load Register', function () {
        register(resource);
    });
});