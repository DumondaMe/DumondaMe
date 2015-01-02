'use strict';

module.exports = ['$http', '$q', function ($http, $q) {

    this.getUserData = function () {
        var deferred = $q.defer();
        $http.get('api/user/profile').success(function (data) {
            deferred.resolve(data);
        }).error(function () {
            deferred.reject("Ein Fehler ist aufgetretten");
        });
        return deferred.promise;
    };
}];
