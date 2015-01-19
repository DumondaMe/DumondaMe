'use strict';

var profileCtrl = require('../../../app/modules/settings/profileCtrl')[3];

describe('Tests of Profile Default Controller', function () {
    var scope, filter, Profile;

    beforeEach(function (done) {
        inject(function ($rootScope, $filter) {

            scope = $rootScope.$new();

            Profile = {};
            Profile.get = function () {
            };
            Profile.save = function () {
            };
            scope.user = {};
            filter = $filter;
            done();
        });
    });

    it('Successful submit Data to the server', function () {

        profileCtrl(scope, filter, Profile);
        scope.profileForm = {
            $invalid: false,
            $setPristine: function () {
            }
        };

        scope.userDataToChange = {
            forename: 'Hans2',
            surname: 'Wurst2',
            birthday: '2002-02-03',
            street: 'hansdampf2',
            place: 'irgendwo2',
            country: 'nirgendwo2',
            female: true
        };

        var stubHttpService = sinon.stub(Profile, 'save');
        //stubHttpService.returns(q.when());

        scope.submitProfileData();
        stubHttpService.callArg(1);

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.true;
        expect(scope.submitFailedToServer).to.be.false;
    });

    it('Invalid form data. Data not sent to server', function () {

        profileCtrl(scope, filter, Profile);
        scope.profileForm = {
            $invalid: true,
            $setPristine: function () {
            }
        };
        scope.submitFailed = false;

        scope.submitProfileData();

        expect(scope.submitFailed).to.be.true;
    });

    it('Error occurred while sending data. User data are not updated', function () {

        profileCtrl(scope, filter, Profile);
        scope.profileForm = {
            $invalid: false,
            $setPristine: function () {
            }
        };
        scope.submitFailed = false;

        scope.userDataToChange = {
            forename: 'Hans',
            surname: 'Wurst',
            birthday: '2002-02-02',
            street: 'hansdampf',
            place: 'irgendwo',
            country: 'nirgendwo',
            female: false
        };

        var stubHttpService = sinon.stub(Profile, 'save');

        scope.submitProfileData();
        stubHttpService.callArg(2);

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.false;
        expect(scope.submitFailedToServer).to.be.true;
    });

    it('Getting the user Profile Data back at initialization', function () {

        var stubHttpService = sinon.stub(Profile, 'get');
        stubHttpService.returns('test');
        profileCtrl(scope, filter, Profile);

        expect(scope.userDataToChange).to.equals('test');
    });
});
