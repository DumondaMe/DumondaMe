'use strict';

var loggedInHeaderCtrl = require('../../../app/modules/navigation/loggedInHeaderCtrl')[4];

describe('Tests of loggedIn Header controller', function () {
    var scope, rootScope, UserInfo, profileImage;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            UserInfo = {};
            UserInfo.get = function () {
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

        loggedInHeaderCtrl(scope, rootScope, UserInfo, profileImage);
        stubUserInfoGet.callArg(1);

        expect(rootScope.userHeaderInfo).to.equal(response);
    });

    it('If user info is already loaded then do not reload user info', function () {

        var mockUserInfoGet = sinon.mock(UserInfo).expects('get'),
            response = 'userInfoResponse';

        rootScope.userHeaderInfo = response;
        mockUserInfoGet.never();

        loggedInHeaderCtrl(scope, rootScope, UserInfo, profileImage);

        mockUserInfoGet.verify();
    });
});