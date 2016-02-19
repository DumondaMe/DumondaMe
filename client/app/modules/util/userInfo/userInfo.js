'use strict';

var notifyObervables = function (observables, functionName) {
    angular.forEach(observables, function (observable) {
        observable[functionName]();
    });
};

module.exports = ['UserInfoRequest', '$interval', 'Modification',
    function (UserInfoRequest, $interval, Modification) {

        var isLoggedIn = false, userInfo, modificationInfo, observables = [];

        this.register = function (observable) {
            observables.push(observable);
        };

        this.loginEvent = function () {
            isLoggedIn = true;
            if (!userInfo) {
                userInfo = UserInfoRequest.get(null, function () {
                    notifyObervables(observables, "userInfoChanged");
                    if (isLoggedIn) {
                        modificationInfo = $interval(function () {
                            var modification = Modification.get(null, function () {
                                if (modification.hasChanged) {
                                    notifyObervables(observables, "userInfoChanged");
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
            notifyObervables(observables, "userInfoChanged");
            $interval.cancel(modificationInfo);
        };

        this.getUserInfo = function () {
            return userInfo;
        };

        return this;
    }];
