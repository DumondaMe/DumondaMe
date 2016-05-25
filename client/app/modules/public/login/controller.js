'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', '$state', 'Auth', 'UrlCache', 'IsAuth', function ($scope, $state, Auth, UrlCache, IsAuth) {
    var ctrl = this;

    ctrl.loginRunning = false;

    ctrl.keyPressed = function ($event) {
        if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
            ctrl.login();
        }
    };

    ctrl.login = function () {
        delete ctrl.error;
        ctrl.loginRunning = true;
        //First do a get request to get the correct csrf token
        IsAuth.get(null, function () {
            Auth.login({
                username: ctrl.loginuser.email,
                password: ctrl.loginuser.password
            }).then(function () {
                ctrl.loginRunning = false;
                UrlCache.reset();
                $state.go('home');
            }, function () {
                ctrl.loginRunning = false;
                ctrl.error = "Benutzername existiert nicht oder das Passwort ist falsch!";
            });
        }, function () {
            ctrl.loginRunning = false;
            ctrl.error = "Unbekannter Fehler beim Anmelden. Versuche es später noch einmal.";
        });
    };
}];