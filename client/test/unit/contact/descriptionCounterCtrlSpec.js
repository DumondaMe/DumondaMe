'use strict';

var contactingCtrl = require('../../../app/modules/contact/descriptionCounterCtrl')[1];

describe('Tests of descriptionCounter controller', function () {
    var scope;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();
            done();
        });
    });

    it('Get Groupe Settings', function () {

        contactingCtrl(scope);

        expect(scope.dropdownGroupSettings.length).to.equal(3);
    });
});