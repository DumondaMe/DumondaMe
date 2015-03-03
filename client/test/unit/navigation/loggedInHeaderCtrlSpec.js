'use strict';

var loggedInHeaderCtrl = require('../../../app/modules/navigation/loggedInHeaderCtrl')[6];

describe('Tests of loggedIn Header controller', function () {
    var scope, interval, intervalFunction, rootScope, UserInfo, Modification, profileImage;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            interval = function (parm) {
                intervalFunction = parm;
            };
            interval.cancel = function () {
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

    it('Modification does not send broadcast when no change on server is detected.', function () {

        var sypBroadcast = sinon.spy(rootScope, '$broadcast'),
            stubModificationGet = sinon.stub(Modification, 'get');

        stubModificationGet.returns({});

        loggedInHeaderCtrl(scope, interval, rootScope, UserInfo, Modification, profileImage);
        intervalFunction();
        stubModificationGet.callArg(1);

        expect(sypBroadcast.callCount).to.equal(0);
    });

    it('Modification does send broadcast when change on server is detected.', function () {

        var sypBroadcast = sinon.spy(rootScope, '$broadcast'),
            stubModificationGet = sinon.stub(Modification, 'get');

        stubModificationGet.returns({hasChanged: true});

        loggedInHeaderCtrl(scope, interval, rootScope, UserInfo, Modification, profileImage);
        intervalFunction();
        stubModificationGet.callArg(1);

        expect(sypBroadcast.callCount).to.equal(1);
    });

    it('if scope is destroyed then stop interval of checking update.', function () {

        var sypIntervalCancel = sinon.spy(interval, 'cancel');

        loggedInHeaderCtrl(scope, interval, rootScope, UserInfo, Modification, profileImage);

        rootScope.$broadcast('$destroy');

        expect(sypIntervalCancel.callCount).to.equal(1);
    });
});