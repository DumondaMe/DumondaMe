'use strict';

module.exports = ['$state', '$stateParams', 'IsAuth', 'loginStateHandler', function ($state, $stateParams, IsAuth, loginStateHandler) {

    var isAuth = IsAuth.get(null, function () {
        if (isAuth.isLoggedIn) {
            loginStateHandler.loginEvent();
            if($stateParams.next !== 'login' && $stateParams.next !== 'checkLoginState' ) {
                $state.go($stateParams.next);
            } else {
                $state.go('home');
            }
        } else {
            loginStateHandler.logoutEvent();
            $state.go('login');
        }
    });
}];