'use strict';

module.exports = ['Auth', '$mdSidenav', 'loginStateHandler', 'UserInfo', '$interval', 'Modification',
    function (Auth, $mdSidenav, loginStateHandler, UserInfo, $interval, Modification) {
        var ctrl = this, modificationInfo;
        loginStateHandler.register(ctrl);
        ctrl.isLoggedIn = false;

        ctrl.openLeftNav = function () {
            $mdSidenav("left").toggle();
        };

        ctrl.loginEvent = function () {
            ctrl.isLoggedIn = true;
            if(!ctrl.userHeaderInfo) {
                ctrl.userHeaderInfo = UserInfo.get(null, function () {
                    modificationInfo = $interval(function () {
                        var modification = Modification.get(null, function () {
                            if (modification.hasChanged) {

                            }
                        });
                    }, 30000);
                });
            }
        };

        ctrl.logoutEvent = function () {
            ctrl.isLoggedIn = false;
            delete ctrl.userHeaderInfo;
            $interval.cancel(modificationInfo);
        };
    }];