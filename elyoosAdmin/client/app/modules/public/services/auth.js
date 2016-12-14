'use strict';

module.exports = ['$http', 'loginStateHandler', '$q', function ($http, loginStateHandler, $q) {

    this.login = function (user) {
        var deferred = $q.defer();
        $http.post('/api/login', user).success(function (loggedinUser) {
            loginStateHandler.loginEvent();
            deferred.resolve(loggedinUser);
        }).error(deferred.reject);
        return deferred.promise;
    };
    this.logout = function () {
        var deferred = $q.defer();
        $http.post('/api/logout').success(function () {
            loginStateHandler.logoutEvent();
            deferred.resolve();
        }).error(deferred.reject);
        return deferred.promise;
    };
}];
