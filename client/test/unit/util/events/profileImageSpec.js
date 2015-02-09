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

    it('When event to change image is called then add version', function () {

        profileImage.addProfileImageChangedEvent(scope, 'userData');
        scope.userData.profileImage = 'www.irgendwas.ch/blabla';

        childScope.$emit('elyoos.profileImage.change');
        childScope.$emit('elyoos.profileImage.change');

        expect(scope.userData.profileImage).to.equal('www.irgendwas.ch/blabla?version=3');
    });

    it('When object not available then change nothing', function () {

        profileImage.addProfileImageChangedEvent(scope, 'userData1');
        scope.userData.profileImage = 'www.irgendwas.ch/blabla';

        childScope.$emit('elyoos.profileImage.change');

        expect(scope.userData.profileImage).to.equal('www.irgendwas.ch/blabla');
    });
});
