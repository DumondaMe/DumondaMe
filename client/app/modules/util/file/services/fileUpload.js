'use strict';

module.exports = ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
    this.uploadFileAndJson = function (file, json, uploadUrl) {
        var fd = new FormData();
        if (file) {
            fd.append('file', file);
        }
        fd.append('model', angular.toJson(json));
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
}];
