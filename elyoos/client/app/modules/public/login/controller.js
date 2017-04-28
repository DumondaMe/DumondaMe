'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', '$state', '$stateParams', 'Auth', 'UrlCache', 'IsAuth', 'VerifyRegisterUserRequest', '$timeout', 'ElyModal',
    function ($scope, $state, $stateParams, Auth, UrlCache, IsAuth, VerifyRegisterUserRequest, $timeout, ElyModal) {
        var ctrl = this;
        ctrl.loginuser = {};

        ctrl.loginRunning = false;
        if ($state.is('public.register.verify')) {
            delete ctrl.error;
            ctrl.verifyUser = true;
            VerifyRegisterUserRequest.save({linkId: $stateParams.linkId}, function (resp) {
                ctrl.verifyUser = false;
                ctrl.showSuccessfulVerify = true;
                $timeout(function () {
                    ctrl.loginuser.email = resp.email;
                    ctrl.loginuser.password = '';
                }, 20);
            }, function () {
                ctrl.verifyUser = false;
                ctrl.showErrorVerify = true;
            });
        }

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                ctrl.login();
            }
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.login = function (e) {
            delete ctrl.error;
            ctrl.loginRunning = true;
            //First do a get request to get the correct csrf token
            IsAuth.get(null, function () {
                Auth.login({
                    username: ctrl.loginuser.email,
                    password: ctrl.loginuser.password
                }).then(function () {
                    UrlCache.reset();
                    ElyModal.hide();
                    $state.go('home');
                }, function () {
                    ctrl.loginRunning = false;
                    ctrl.error = "Benutzername existiert nicht oder das Passwort ist falsch!";
                });
            }, function () {
                ctrl.loginRunning = false;
                ctrl.error = "Unbekannter Fehler beim Anmelden. Versuche es später noch einmal.";
            });
            e.preventDefault();
        };
    }];
