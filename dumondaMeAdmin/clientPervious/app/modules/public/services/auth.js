'use strict';

module.exports = ['$http', 'loginStateHandler', function ($http, loginStateHandler) {

    this.login = function (user) {
        return $http.post('/api/login', user).then(function (loggedinUser) {
            loginStateHandler.loginEvent();
            return loggedinUser.data;
        });
    };
    this.logout = function () {
        return $http.post('/api/logout').then(function () {
            loginStateHandler.logoutEvent();
        });
    };
}];
