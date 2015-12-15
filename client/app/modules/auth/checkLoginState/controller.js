'use strict';

module.exports = ['$state', '$stateParams', 'IsAuth', 'loginStateHandler', function ($state, $stateParams, IsAuth, loginStateHandler) {

    var isAuth = IsAuth.get(null, function () {
        if (isAuth.isLoggedIn) {
            loginStateHandler.loginEvent();
            $state.go($stateParams.next);
        } else {
            loginStateHandler.logoutEvent();
            $state.go('login');
        }
    });
}];