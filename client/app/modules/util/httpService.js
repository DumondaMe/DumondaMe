'use strict';

module.exports = ['$http', '$q', function ($http, $q) {

    $http.defaults.headers.put['Content-Type'] = 'application/json';

    this.sendGetWithRequestData = function (data, url) {
        var deferred = $q.defer(),
            config = {};

        config.params = data;
        $http.get(url, config).success(function (receivedData) {
            deferred.resolve(receivedData);
        }).error(deferred.reject);
        return deferred.promise;
    };

    this.sendGetRequest = function (url) {
        var deferred = $q.defer();
        $http.get(url).success(function (receivedData) {
            deferred.resolve(receivedData);
        }).error(deferred.reject);
        return deferred.promise;
    };

    this.sendPostRequest = function (data, url) {
        var deferred = $q.defer();
        $http.post(url, data).success(function (receivedData) {
            deferred.resolve(receivedData);
        }).error(deferred.reject);
        return deferred.promise;
    };

    this.sendDeleteRequest = function (data, url) {
        var deferred = $q.defer();
        $http.post(url, data, {headers: {'X-HTTP-Method-Override': 'DELETE'}}).success(function (receivedData) {
            deferred.resolve(receivedData);
        }).error(deferred.reject);
        return deferred.promise;
    };
}];
