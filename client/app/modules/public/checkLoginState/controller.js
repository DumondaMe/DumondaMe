'use strict';

module.exports = ['$state', 'IsAuth', 'loginStateHandler', 'CheckLoginStateParamsContainer',
    function ($state, IsAuth, loginStateHandler, CheckLoginStateParamsContainer) {

    var isAuth = IsAuth.get(null, function () {
        if (isAuth.isLoggedIn) {
            loginStateHandler.loginEvent();
            if(CheckLoginStateParamsContainer.getNext() !== 'public' && CheckLoginStateParamsContainer.getNext() !== 'checkLoginState' ) {
                $state.go(CheckLoginStateParamsContainer.getNext(), CheckLoginStateParamsContainer.getParams());
            } else {
                $state.go('home');
            }
        } else {
            loginStateHandler.logoutEvent();
            $state.go('public');
        }
    });
}];
