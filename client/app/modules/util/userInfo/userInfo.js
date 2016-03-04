'use strict';

module.exports = ['UserInfoRequest', '$interval', 'Modification', 'Observables', 'UploadProfileImageState',
    function (UserInfoRequest, $interval, Modification, Observables, UploadProfileImageState) {

        var isLoggedIn = false, userInfo, modificationInfo, observables = [], service = this;

        service.register = function (name, observable) {
            Observables.register(observables, name, observable);
        };

        service.remove = function (name) {
            observables = Observables.remove(observables, name);
        };

        service.loginEvent = function () {
            isLoggedIn = true;
            if (!userInfo) {
                userInfo = UserInfoRequest.get(null, function () {
                    Observables.notifyObservables(observables, "userInfoChanged", userInfo);
                    if (isLoggedIn) {
                        modificationInfo = $interval(function () {
                            var modification = Modification.get(null, function () {
                                if (modification.hasChanged) {
                                    Observables.notifyObservables(observables, "modificationChanged", modification);
                                }
                            });
                        }, 30000);
                    }
                });
            }
        };

        service.logoutEvent = function () {
            isLoggedIn = false;
            userInfo = undefined;
            Observables.notifyObservables(observables, "userInfoChanged");
            $interval.cancel(modificationInfo);
        };

        service.getUserInfo = function () {
            return userInfo;
        };

        UploadProfileImageState.register('userInfo', service);

        service.profileImageChangedEvent = function () {
            userInfo = UserInfoRequest.get(null, function () {
                Observables.notifyObservables(observables, "userInfoChanged", userInfo);
            });
        };

        service.profileDataChangedEvent = function () {
            userInfo = UserInfoRequest.get(null, function () {
                Observables.notifyObservables(observables, "userInfoChanged", userInfo);
            });
        };
    }];
