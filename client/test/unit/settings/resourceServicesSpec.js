'use strict';

var userInfo = require('../../../app/modules/settings/profile')[1];
var privacy = require('../../../app/modules/settings/privacy')[1];
var password = require('../../../app/modules/settings/password')[1];

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

    it('Load Privacy', function () {
        privacy(resource);
    });

    it('Load Password', function () {
        password(resource);
    });
});