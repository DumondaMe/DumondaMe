'use strict';

module.exports = ['$scope', 'userInfo', '$mdDialog', 'CreateProblemReasonCheck', 'UploadReason', '$stateParams',
    function ($scope, userInfo, $mdDialog, CreateProblemReasonCheck, UploadReason, $stateParams) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };


        ctrl.uploadReason = function () {
            if (ctrl.sendReasonAllowed && !ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadReason.upload($scope.titleReason, $scope.descriptionReason, $stateParams.problemId).then(function (resp) {
                    $mdDialog.hide(resp);
                });
            }
        };

        $scope.$watch('titleReason', function (newReasonTitle) {
            ctrl.sendReasonAllowed = CreateProblemReasonCheck.isSendReasonAllowed(newReasonTitle, $scope.descriptionReason);
        });

        $scope.$watch('descriptionReason', function (newReasonDescription) {
            ctrl.sendReasonAllowed = CreateProblemReasonCheck.isSendReasonAllowed($scope.titleReason, newReasonDescription);
        });
    }];

