'use strict';

module.exports = ['$scope', 'userInfo', 'UploadProfileImageState',
    function ($scope, userInfo, UploadProfileImageState) {
        var ctrl = this, userInfoName = 'accountSetupProfileImage';

        ctrl.finish = function () {
            delete ctrl.commandStepperDialog;
            ctrl.selectedImage = false;
            ctrl.uploadRunning = false;
            UploadProfileImageState.profileImageChanged();
        };

        ctrl.showCropImage = function () {
            ctrl.selectedImage = true;
            ctrl.commandAbortStepperDialog = ctrl.finish;
            ctrl.commandStepperDialogLabel = 'Hochladen';
        };

        ctrl.userInfoChanged = function () {
            ctrl.profileImage = userInfo.getUserInfo().profileImagePreview;
        };

        $scope.$watch('step.selected', function (selected) {
            if (selected) {
                ctrl.selectedImage = false;
                ctrl.uploadRunning = false;
                delete ctrl.commandStepperDialog;
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
