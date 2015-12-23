'use strict';

module.exports = ['UserInfoRequest', '$interval', 'Modification',
    function (UserInfoRequest, $interval, Modification) {

        var isLoggedIn = false, userInfo, modificationInfo;

        this.loginEvent = function () {
            isLoggedIn = true;
            if (!userInfo) {
                userInfo = UserInfoRequest.get(null, function () {
                    if (isLoggedIn) {
                        modificationInfo = $interval(function () {
                            var modification = Modification.get(null, function () {
                                if (modification.hasChanged) {

                                }
                            });
                        }, 30000);
                    }
                });
            }
        };

        this.logoutEvent = function () {
            isLoggedIn = false;
            userInfo = undefined;
            $interval.cancel(modificationInfo);
        };

        this.getUserInfo = function () {
            return userInfo;
        };

        return this;
    }];
