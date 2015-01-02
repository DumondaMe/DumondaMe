'use strict';

var LoginCtrl = require('../../../app/modules/auth/loginCtrl')[3];

describe('Tests of Login Controller', function () {
    var testee, timeout, scope, q, AuthMock;

    beforeEach(function (done) {
        inject(function ($rootScope, $location, $timeout, $q) {

            scope = $rootScope.$new();
            timeout = $timeout;
            q = $q;

            AuthMock = {
                login: function () {
                }
            };
            testee = new LoginCtrl(scope, $location, AuthMock);
            done();
        });
    });


    it('Successful Login', function () {

        var stubAuth = sinon.stub(AuthMock, 'login'),
            spyUpdateUser;
        stubAuth.returns(q.when(200));
        scope.loginuser = {email: "aha@irgend.ch", password: "1234"};
        scope.updateUser = function () {
        };
        spyUpdateUser = sinon.spy(scope, 'updateUser');

        scope.login();

        expect(stubAuth.calledOnce).to.be.true;
        timeout.flush();
        expect(spyUpdateUser.calledOnce).to.be.true;

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
