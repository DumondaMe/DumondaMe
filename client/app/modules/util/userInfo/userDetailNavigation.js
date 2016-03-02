'use strict';


module.exports = ['$state',
    function ($state) {

        this.openUserDetail = function(userId, isLoggedInUser) {
            if(isLoggedInUser) {
                $state.go('settings.profile');
            } else {
                $state.go('user.detail', {userId: userId});
            }
        };
    }];
