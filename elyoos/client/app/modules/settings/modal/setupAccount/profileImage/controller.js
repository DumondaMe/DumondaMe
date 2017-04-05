'use strict';

module.exports = ['$scope', 'userInfo', 'UploadProfileImageState',
    function ($scope, userInfo, UploadProfileImageState) {
        var ctrl = this, userInfoName = 'accountSetupProfileImage';

        ctrl.finish = function () {
            ctrl.selectedImage = false;
            UploadProfileImageState.profileImageChanged();
        };

        ctrl.userInfoChanged = function () {
            ctrl.profileImage = userInfo.getUserInfo().profileImagePreview;
        };

        $scope.$watch('step.selected', function (selected) {
            if (selected) {
                ctrl.selectedImage = false;
                userInfo.register(userInfoName, ctrl);
            } else {
                userInfo.remove(userInfoName);
            }
        });

        $scope.$on("$destroy", function () {
            userInfo.remove(userInfoName);
        });

        ctrl.profileImage = userInfo.getUserInfo().profileImagePreview;
    }];
