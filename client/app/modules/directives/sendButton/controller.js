'use strict';

var resetMessageNotification = function ($scope) {
    $scope.showError = false;
    $scope.showSuccess = false;
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            var originalModel, lastModel;

            $scope.sendButtonDisabled = true;

            resetMessageNotification($scope);

            $scope.$watchCollection('model', function (newValue) {

                if (newValue.$resolved && !originalModel) {
                    originalModel = {};
                    angular.copy($scope.model, originalModel);
                }
                if (originalModel && newValue) {
                    lastModel = newValue;
                    if (angular.equals(originalModel, newValue)) {
                        $scope.sendButtonDisabled = true;
                    } else {
                        $scope.sendButtonDisabled = false;
                        $scope.showSuccess = false;
                    }
                }
            });

            $scope.sendAllData = function () {
                resetMessageNotification($scope);
                $scope.sendData();
            };

            $scope.$on('ely.send.button.error', function (event, errorDescription) {
                $scope.errorDescription = {title: errorDescription};
                $scope.showError = true;
                $scope.showSuccess = false;
            });

            $scope.$on('ely.send.button.success', function () {
                angular.copy($scope.model, originalModel);
                $scope.sendButtonDisabled = true;
                $scope.showError = false;
                $scope.showSuccess = true;
            });
        }];
    }
};
