'use strict';

module.exports = ['$http', '$cookies', '$q', function ($http, $cookies, $q) {

    var currentUser = $cookies.getObject('user') || {username: undefined};

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    this.authorize = function (isPublic) {
        if (isPublic) {
            return true;
        }
        return currentUser.username !== undefined;
    };
    this.login = function (user) {
        var deferred = $q.defer();
        $http.post('/api/login', user).success(function (loggedinUser) {
            changeUser(loggedinUser);
            deferred.resolve(loggedinUser);
        }).error(deferred.reject);
        return deferred.promise;
    };
    this.logout = function () {
        var deferred = $q.defer();
        $http.post('/api/logout').success(function () {
            changeUser({
                username: undefined
            });
            $cookies.remove('user');
            deferred.resolve();
        }).error(deferred.reject);
        return deferred.promise;
    };
}];
