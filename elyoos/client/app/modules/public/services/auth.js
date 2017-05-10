'use strict';

module.exports = ['$http', 'loginStateHandler', '$q', function ($http, loginStateHandler, $q) {

    this.login = function (user, canceller) {
        var deferred = $q.defer();
        $http({method: 'POST', url: '/api/login', timeout: canceller, data: user})
            .then(function (loggedinUser) {
                if (loggedinUser.config && loggedinUser.config.timeout && loggedinUser.config.timeout.$$state &&
                    loggedinUser.config.timeout.$$state.status === 0) {
                    loginStateHandler.loginEvent();
                    deferred.resolve(loggedinUser);
                } else {
                    deferred.reject();
                }
            }, function () {
                deferred.reject();
            });
        return deferred.promise;
    };
    this.logout = function () {
        return $http.post('/api/logout').then(function () {
            loginStateHandler.logoutEvent();
        });
    };
}];
