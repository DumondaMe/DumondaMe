'use strict';

var profileImage = require('../../../../app/modules/util/events/profileImage')[0]();

describe('Tests of the profile image events', function () {
    var scope, childScope;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();
            childScope = scope.$new();
            scope.userData = {};
            done();
        });
    });

    it('When event to change image is called then callback function is called', function () {

        var callbackCalled = false;
        profileImage.addProfileImageChangedEvent(scope, function () {
            callbackCalled = true;
        });

        childScope.$emit('elyoos.profileImage.change');

        expect(callbackCalled).to.be.true;
    });
});
