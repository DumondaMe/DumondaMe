'use strict';

var message = require('../../../../app/modules/messages/services/message')[1];

describe('Tests all services of messages for http requests', function () {
    var resource;

    beforeEach(function (done) {
        angular.mock.module('ngResource');
        inject(function ($resource) {
            resource = $resource;
            done();
        });
    });

    it('Load Message', function () {
        message(resource);
    });
});