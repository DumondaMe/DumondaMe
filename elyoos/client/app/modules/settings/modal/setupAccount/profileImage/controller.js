'use strict';

module.exports = ['$scope', 'userInfo', 'UploadProfileImageState', 'StepperDialogSteps',
    'StepperDialogCommandHandler',
    function ($scope, userInfo, UploadProfileImageState, StepperDialogSteps, StepperDialogCommandHandler) {
        var ctrl = this, userInfoName = 'accountSetupProfileImage';

        userInfo.register(userInfoName, ctrl);

        ctrl.commandStepperDialog = function () {
            ctrl.startUploadImage();
        };

        ctrl.finish = function () {
            ctrl.selectedImage = false;
            StepperDialogCommandHandler.hideProgressBar();
            StepperDialogCommandHandler.hideButtonCommand();
            UploadProfileImageState.profileImageChanged();
        };

        ctrl.showCropImage = function () {
            ctrl.selectedImage = true;
            StepperDialogCommandHandler.showButtonCommand(ctrl.finish, ctrl.commandStepperDialog, 'Hochladen');
        };

        ctrl.userInfoChanged = function () {
            ctrl.profileImage = userInfo.getUserInfo().profileImagePreview;
        };

        ctrl.hasImage = function (newHasImage) {
            if (newHasImage) {
                StepperDialogCommandHandler.enableButtonCommand();
            } else {
                StepperDialogCommandHandler.disableButtonCommand();
            }
        };

        ctrl.uploadRunning = function (newUploadRunning) {
            if (newUploadRunning) {
                StepperDialogCommandHandler.showProgressBar();
            } else {
                StepperDialogCommandHandler.hideProgressBar();
            }
        };

        $scope.$on("$destroy", function () {
            userInfo.remove(userInfoName);
        });

        ctrl.step = {
            label: 'Profilbild',
            selected: false
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.profileImage = userInfo.getUserInfo().profileImagePreview;
    }];
