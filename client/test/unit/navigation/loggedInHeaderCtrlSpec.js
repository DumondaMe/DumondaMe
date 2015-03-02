'use strict';

var loggedInHeaderCtrl = require('../../../app/modules/navigation/loggedInHeaderCtrl')[6];

describe('Tests of loggedIn Header controller', function () {
    var scope, interval, intervalFunction, rootScope, UserInfo, Modification, profileImage;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            interval = function (parm) {
                intervalFunction = parm;
            };

            UserInfo = {};
            UserInfo.get = function () {
            };

            Modification = {};
            Modification.get = function () {
            };

            profileImage = {};
            profileImage.addProfileImageChangedEvent = function () {
            };

            rootScope = $rootScope;
            scope = $rootScope.$new();
            done();
        });
    });

    it('If controller is loaded and there is no user info then load user info', function () {

        var stubUserInfoGet = sinon.stub(UserInfo, 'get'),
            response = 'userInfoResponse';

        stubUserInfoGet.returns(response);

        loggedInHeaderCtrl(scope, interval, rootScope, UserInfo, Modification, profileImage);
        stubUserInfoGet.callArg(1);

        expect(rootScope.userHeaderInfo).to.equal(response);
    });

    it('If user info is already loaded then do not reload user info', function () {

        var mockUserInfoGet = sinon.mock(UserInfo).expects('get'),
            response = 'userInfoResponse';

        rootScope.userHeaderInfo = response;
        mockUserInfoGet.never();

        loggedInHeaderCtrl(scope, interval, rootScope, UserInfo, Modification, profileImage);

        mockUserInfoGet.verify();
    });
});