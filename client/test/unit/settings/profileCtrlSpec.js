'use strict';

var profileCtrl = require('../../../app/modules/settings/profileCtrl')[4];
var moment = require('../../../app/lib/moment/moment');

describe('Tests of Profile Default Controller', function () {
    var scope, Profile, profileImage;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();

            Profile = {};
            Profile.get = function () {
            };
            Profile.save = function () {
            };
            scope.user = {};
            profileImage = {};
            profileImage.addProfileImageChangedEvent = function () {
            };
            done();
        });
    });

    it('Successful submit Data to the server', function () {

        moment.locale('de');
        profileCtrl(scope, Profile, profileImage, moment);
        scope.profileForm = {
            $invalid: false,
            $setPristine: function () {
            }
        };

        scope.userDataToChange = {
            forename: 'Hans2',
            surname: 'Wurst2',
            birthday: '26.03.1982',
            street: 'hansdampf2',
            place: 'irgendwo2',
            country: 'nirgendwo2',
            female: true
        };

        var stubHttpService = sinon.stub(Profile, 'save'), submitedData;

        scope.submitProfileData();
        submitedData = stubHttpService.firstCall.args[0];
        stubHttpService.callArg(1);

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.true;
        expect(scope.submitFailedToServer).to.be.false;
        expect(submitedData.birthday).to.equals(385948800);
    });

    it('Invalid form data. Data not sent to server', function () {

        profileCtrl(scope, Profile, profileImage, moment);
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

        profileCtrl(scope, Profile, profileImage, moment);
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

        var stubProfile = sinon.stub(Profile, 'get');
        moment.locale('de');
        stubProfile.returns({birthday: 385948800});
        profileCtrl(scope, Profile, profileImage, moment);
        stubProfile.callArg(1);

        expect(scope.userDataToChange).to.eql({birthday: '26.3.1982'});
    });

    it('Getting a date example for german local format', function () {

        var stubHttpService = sinon.stub(Profile, 'get');
        stubHttpService.returns('test');
        moment.locale('de');
        profileCtrl(scope, Profile, profileImage, moment);

        expect(scope.getDateExample()).to.equals('26.3.1982');
    });

    it('Getting a date example for english local format', function () {

        var stubHttpService = sinon.stub(Profile, 'get');
        stubHttpService.returns('test');
        moment.locale('en');
        profileCtrl(scope, Profile, profileImage, moment);

        expect(scope.getDateExample()).to.equals('3/26/1982');
    });

    it('Check of date returns that the german date is valid', function () {

        var sypSetValidity;
        sinon.stub(Profile, 'get');
        scope.profileForm = {};
        scope.profileForm.inputBirthday = {};
        scope.profileForm.inputBirthday.$setValidity = function () {
        };
        sypSetValidity = sinon.spy(scope.profileForm.inputBirthday, '$setValidity');

        moment.locale('de');
        profileCtrl(scope, Profile, profileImage, moment);

        scope.userDataToChange = {
            birthday: '26.3.1982'
        };
        scope.$digest();

        expect(sypSetValidity.getCall(0).args[1]).to.be.true;
    });

    it('Check of date returns that the german date is invalid', function () {

        var sypSetValidity;
        sinon.stub(Profile, 'get');
        scope.profileForm = {};
        scope.profileForm.inputBirthday = {};
        scope.profileForm.inputBirthday.$setValidity = function () {
        };
        sypSetValidity = sinon.spy(scope.profileForm.inputBirthday, '$setValidity');

        moment.locale('de');
        profileCtrl(scope, Profile, profileImage, moment);

        scope.userDataToChange = {
            birthday: '3.26.1982'
        };
        scope.$digest();

        expect(sypSetValidity.getCall(0).args[1]).to.be.false;
    });

    it('Check of date returns that the english date is valid', function () {

        var sypSetValidity;
        sinon.stub(Profile, 'get');
        scope.profileForm = {};
        scope.profileForm.inputBirthday = {};
        scope.profileForm.inputBirthday.$setValidity = function () {
        };
        sypSetValidity = sinon.spy(scope.profileForm.inputBirthday, '$setValidity');

        moment.locale('en');
        profileCtrl(scope, Profile, profileImage, moment);

        scope.userDataToChange = {
            birthday: '3/26/1982'
        };
        scope.$digest();

        expect(sypSetValidity.getCall(0).args[1]).to.be.true;
    });

    it('Check of date returns that the english date is invalid', function () {

        var sypSetValidity;
        sinon.stub(Profile, 'get');
        scope.profileForm = {};
        scope.profileForm.inputBirthday = {};
        scope.profileForm.inputBirthday.$setValidity = function () {
        };
        sypSetValidity = sinon.spy(scope.profileForm.inputBirthday, '$setValidity');

        moment.locale('en');
        profileCtrl(scope, Profile, profileImage, moment);

        scope.userDataToChange = {
            birthday: '26/3/1982'
        };
        scope.$digest();

        expect(sypSetValidity.getCall(0).args[1]).to.be.false;
    });
});
