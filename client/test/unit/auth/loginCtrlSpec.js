'use strict';

var LoginCtrl = require('../../../app/modules/auth/loginCtrl')[5];

describe('Tests of Login Controller', function () {
    var testee, timeout, scope, q, AuthMock, UrlCache, state;

    beforeEach(function (done) {
        inject(function ($rootScope, $timeout, $q) {

            scope = $rootScope.$new();
            timeout = $timeout;
            q = $q;

            AuthMock = {
                login: function () {
                }
            };
            UrlCache = {
                reset: function () {
                }
            };
            state = {
                go: function () {
                }
            };
            testee = new LoginCtrl(scope, $rootScope, state, AuthMock, UrlCache);
            done();
        });
    });


    it('Successful Login', function () {

        var stubAuth = sinon.stub(AuthMock, 'login');
        stubAuth.returns(q.when(200));
        scope.loginuser = {email: "aha@irgend.ch", password: "1234"};
        scope.updateUser = function () {
        };

        scope.login();

        expect(stubAuth.calledOnce).to.be.true;
        timeout.flush();

    });

    it('Login Failed', function () {

        var stubAuth = sinon.stub(AuthMock, 'login'),
            spyUpdateUser;
        stubAuth.returns(q.reject());
        scope.loginuser = {email: "aha@irgend.ch", password: "1234"};
        scope.updateUser = function () {
        };
        spyUpdateUser = sinon.spy(scope, 'updateUser');

        scope.login();

        expect(stubAuth.calledOnce).to.be.true;
        timeout.flush();
        expect(spyUpdateUser.called).to.be.false;
    });
});
