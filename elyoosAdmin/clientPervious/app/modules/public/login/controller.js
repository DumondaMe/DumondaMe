'use strict';

var charCodeEnter = 13;

module.exports = ['$state', 'Auth',
    function ($state, Auth) {
        var ctrl = this;
        ctrl.loginuser = {};

        ctrl.loginRunning = false;

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                ctrl.login();
            }
        };

        ctrl.login = function () {
            delete ctrl.error;
            ctrl.loginRunning = true;
            Auth.login({
                username: ctrl.loginuser.email,
                password: ctrl.loginuser.password
            }).then(function () {
                ctrl.loginRunning = false;
                $state.go('home');
            }, function () {
                ctrl.loginRunning = false;
                ctrl.error = "Benutzername existiert nicht oder das Passwort ist falsch!";
            });
        };
    }];
