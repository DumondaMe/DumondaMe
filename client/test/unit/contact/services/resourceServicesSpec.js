'use strict';

var contact = require('../../../../app/modules/contact/services/contact')[1];
var contactDetail = require('../../../../app/modules/contact/services/contactDetail')[1];
var contacting = require('../../../../app/modules/contact/services/contacting')[1];
var searchUsers = require('../../../../app/modules/contact/services/searchUsers')[1];

describe('Tests all services of contact for http requests', function () {
    var resource;

    beforeEach(function (done) {
        angular.mock.module('ngResource');
        inject(function ($resource) {
            resource = $resource;
            done();
        });
    });

    it('Load Contact', function () {
        contact(resource);
    });

    it('Load Contact Detail', function () {
        contactDetail(resource);
    });

    it('Load Contacting', function () {
        contacting(resource);
    });

    it('Load SearchUsers', function () {
        searchUsers(resource);
    });
});