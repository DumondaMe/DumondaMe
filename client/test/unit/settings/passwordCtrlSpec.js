'use strict';

var passwordCtrl = require('../../../app/modules/settings/passwordCtrl')[2];

describe('Tests of Password Controller', function () {
    var scope, Password;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();

            Password = {};
            Password.save = function () {
            };
            scope.profileForm = {
                $invalid: false,
                $setPristine: function () {
                },
                inputPassword: {
                    $error: {
                        minlenght: false
                    }
                }
            };
            done();
        });
    });

    it('Successful sending of message to change the password', function () {

        passwordCtrl(scope, Password);
        scope.password = {
            newPassword: 'ur3miOsw',
            newPasswordConfirm: 'ur3miOsw',
            actualPassword: '1'
        };

        var stubHttpService = sinon.stub(Password, 'save');

        scope.submitNewPassword();
        stubHttpService.firstCall.args[0];
        stubHttpService.callArg(1);

        expect(scope.submitFailed).to.be.false;
        expect(scope.successUserDataChange).to.be.true;
        expect(scope.submitFailedToServer).to.be.false;
    });

    it('Sending of message failed because of to short password', function () {

        passwordCtrl(scope, Password);
        scope.password = {
            newPassword: 'ur3miOs',
            newPasswordConfirm: 'ur3miOs',
            actualPassword: '1'
        };

        var stubHttpService = sinon.stub(Password, 'save');

        scope.submitNewPassword();

        expect(stubHttpService.called).to.be.false;
        expect(scope.profileForm.inputPassword.$error.minlength).to.be.true;
    });

    it('Sending of message failed because new password and passwort to confirm are not equal', function () {

        passwordCtrl(scope, Password);
        scope.password = {
            newPassword: 'ur3miOsw',
            newPasswordConfirm: 'ur3miOse',
            actualPassword: '1'
        };

        var stubHttpService = sinon.stub(Password, 'save');

        scope.submitNewPassword();

        expect(stubHttpService.called).to.be.false;
        expect(scope.newPasswordNotEqual).to.be.true;
        expect(scope.password.newPasswordConfirm).to.equals('');
    });
});
