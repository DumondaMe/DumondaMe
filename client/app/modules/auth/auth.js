'use strict';

module.exports = ['$http', '$cookieStore', '$q', function ($http, $cookieStore, $q) {

    var currentUser = $cookieStore.get('user') || {username: undefined};

    $cookieStore.remove('user');

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
        $http.post('/api/login', user).showSuccess(function (loggedinUser) {
            changeUser(loggedinUser);
            deferred.resolve(loggedinUser);
        }).error(deferred.reject);
        return deferred.promise;
    };
    this.logout = function () {
        var deferred = $q.defer();
        $http.post('/api/logout').showSuccess(function () {
            changeUser({
                username: undefined
            });
            deferred.resolve();
        }).error(deferred.reject);
        return deferred.promise;
    };
}];
