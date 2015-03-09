'use strict';

var loggedInHeaderCtrl = require('../../../app/modules/navigation/loggedInHeaderCtrl')[8];

describe('Tests of loggedIn Header controller', function () {
    var scope, state, interval, intervalFunction, rootScope, UserInfo, Modification, profileImage, AuthMock, q, timeout;

    beforeEach(function (done) {
        inject(function ($rootScope, $timeout, $q) {

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

            state = {
                go: function () {
                }
            };
            AuthMock = {
                logout: function () {
                }
            };

            timeout = $timeout;
            q = $q;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            done();
        });
    });

    it('If controller is loaded and there is no user info then load user info', function () {

        var stubUserInfoGet = sinon.stub(UserInfo, 'get'),
            response = 'userInfoResponse';

        stubUserInfoGet.returns(response);

        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);
        stubUserInfoGet.callArg(1);

        expect(rootScope.userHeaderInfo).to.equal(response);
    });

    it('If user info is already loaded then do not reload user info', function () {

        var mockUserInfoGet = sinon.mock(UserInfo).expects('get'),
            response = 'userInfoResponse';

        rootScope.userHeaderInfo = response;
        mockUserInfoGet.never();

        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);

        mockUserInfoGet.verify();
    });

    it('Modification does not send broadcast when no change on server is detected.', function () {

        var sypBroadcast = sinon.spy(rootScope, '$broadcast'),
            stubModificationGet = sinon.stub(Modification, 'get');

        stubModificationGet.returns({});

        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);
        intervalFunction();
        stubModificationGet.callArg(1);

        expect(sypBroadcast.callCount).to.equal(0);
    });

    it('Modification does send broadcast when change on server is detected.', function () {

        var sypBroadcast = sinon.spy(rootScope, '$broadcast'),
            stubModificationGet = sinon.stub(Modification, 'get');

        stubModificationGet.returns({hasChanged: true});

        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);
        intervalFunction();
        stubModificationGet.callArg(1);

        expect(sypBroadcast.callCount).to.equal(1);
    });

    it('if scope is destroyed then stop interval of checking update.', function () {

        var sypIntervalCancel = sinon.spy(interval, 'cancel');

        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);

        rootScope.$broadcast('$destroy');

        expect(sypIntervalCancel.callCount).to.equal(1);
    });

    it('Successful Logout', function () {

        var stubAuth = sinon.stub(AuthMock, 'logout'), mockState = sinon.mock(state);
        stubAuth.returns(q.when(200));

        mockState.expects('go').once();
        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);
        scope.logout();

        timeout.flush();
        mockState.verify();

    });

    it('Failed Logout', function () {

        var stubAuth = sinon.stub(AuthMock, 'logout'), mockState = sinon.mock(state);
        stubAuth.returns(q.reject());
        rootScope.user = 'Einfach irgendwas';

        mockState.expects('go').never();
        loggedInHeaderCtrl(scope, state, interval, rootScope, UserInfo, Modification, profileImage, AuthMock);
        scope.logout();

        timeout.flush();
        expect(scope.error).to.not.be.undefined;
        mockState.verify();

    });
});