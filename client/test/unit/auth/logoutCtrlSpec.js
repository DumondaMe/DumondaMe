'use strict';

var LogoutCtrl = require('../../../app/modules/auth/logoutCtrl')[4];

describe('Tests of Logout Controller', function () {
    var testee, timeout, scope, rootScope, state, q, AuthMock;

    beforeEach(function (done) {
        inject(function ($rootScope, $timeout, $q) {

            scope = $rootScope.$new();
            rootScope = $rootScope;
            timeout = $timeout;
            q = $q;

            state = {
                go: function () {
                }
            };
            AuthMock = {
                logout: function () {
                }
            };
            done();
        });
    });

    it('Successful Logout', function () {

        var stubAuth = sinon.stub(AuthMock, 'logout');
        stubAuth.returns(q.when(200));

        testee = new LogoutCtrl(scope, rootScope, state, AuthMock);
        rootScope.logout();

        expect(stubAuth.calledOnce).to.be.true;
        timeout.flush();
        expect(scope.logoutMessage).to.not.be.undefined;
        expect(rootScope.user).to.be.undefined;

    });

    it('Failed Logout', function () {

        var stubAuth = sinon.stub(AuthMock, 'logout');
        stubAuth.returns(q.reject());
        rootScope.user = 'Einfach irgendwas';

        testee = new LogoutCtrl(scope, rootScope, state, AuthMock);
        rootScope.logout();

        expect(stubAuth.calledOnce).to.be.true;
        timeout.flush();
        expect(scope.logoutMessage).to.not.be.undefined;
        expect(rootScope.user).to.not.be.undefined;

    });
});
