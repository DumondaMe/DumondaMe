'use strict';

var notifyObervables = function (observables, functionName, functionParam) {
    angular.forEach(observables, function (observable) {
        if (observable.observable.hasOwnProperty(functionName)) {
            observable.observable[functionName](functionParam);
        }
    });
};

module.exports = ['UserInfoRequest', '$interval', 'Modification',
    function (UserInfoRequest, $interval, Modification) {

        var isLoggedIn = false, userInfo, modificationInfo, observables = [];

        this.register = function (name, observable) {
            observables.push({name: name, observable: observable});
        };

        this.remove = function (name) {
            observables = observables.filter(function(observable) {
                return observable.name !== name;
            });
        };

        this.loginEvent = function () {
            isLoggedIn = true;
            if (!userInfo) {
                userInfo = UserInfoRequest.get(null, function () {
                    notifyObervables(observables, "userInfoChanged", userInfo);
                    if (isLoggedIn) {
                        modificationInfo = $interval(function () {
                            var modification = Modification.get(null, function () {
                                if (modification.hasChanged) {
                                    notifyObervables(observables, "modificationChanged", modification);
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
