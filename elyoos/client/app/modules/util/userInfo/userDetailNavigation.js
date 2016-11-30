'use strict';


module.exports = ['$state', 'userInfo',
    function ($state, userInfo) {

        var service = this, userInfoData;

        userInfoData = userInfo.getUserInfo();
        userInfo.register('leftNav', service);
        service.userInfoChanged = function () {
            userInfoData = userInfo.getUserInfo();
        };

        this.openUserDetail = function (userId, isLoggedInUser) {
            if (isLoggedInUser) {
                $state.go('settings.profile');
            } else {
                if (userInfoData && userInfoData.userId === userId) {
                    $state.go('settings.profile');
                } else {
                    $state.go('user.detail', {userId: userId});
                }
            }
        };
    }];
