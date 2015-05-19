'use strict';

var userInfo = require('../../../app/modules/navigation/services/userInfo')[1];
var modification = require('../../../app/modules/navigation/services/modification')[1];

describe('Tests all Services of the navigation for http requests', function () {
    var resource;

    beforeEach(function (done) {
        angular.mock.module('ngResource');
        inject(function ($resource) {
            resource = $resource;
            done();
        });
    });

    it('Load UserInfo', function () {
        userInfo(resource);
    });

    it('Load Modification', function () {
        modification(resource);
    });
});