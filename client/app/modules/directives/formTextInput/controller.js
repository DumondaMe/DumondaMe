'use strict';

var setShowError = function ($scope) {
    if ($scope.showErrorMaxLength || $scope.showErrorRequired || $scope.showErrorCustom) {
        $scope.showError = true;
    } else {
        $scope.showError = false;
    }
};

var setError = function ($scope, newValue, errorName, errorDescription) {
    if (newValue) {
        $scope[errorName] = true;
        $scope.lastErrorDescription.unshift({title: errorDescription});
        $scope.errorDescription = $scope.lastErrorDescription[0];
    } else {
        $scope.lastErrorDescription.shift();
        if ($scope.lastErrorDescription.length > 0) {
            $scope.errorDescription = $scope.lastErrorDescription[0];
        }

        $scope[errorName] = false;
    }
    setShowError($scope);
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.lastErrorDescription = [];
            $scope.showErrorCounter = 0;

            $scope.$watch(function () {
                return $scope.profileForm[$scope.inputName].$error.maxlength;
            }, function (newValue) {
                setError($scope, newValue, 'showErrorMaxLength', 'Darf maximal ' + $scope.maxLength + ' Zeichen haben');
            });

            $scope.$watch(function () {
                return $scope.profileForm[$scope.inputName].$error.required;
            }, function (newValue) {
                setError($scope, newValue, 'showErrorRequired', $scope.label + ' wird ben\u00f6tigt');
            });

            $scope.$watch(function () {
                return $scope.profileForm[$scope.inputName].$error.custom;
            }, function (newValue) {
                setError($scope, newValue, 'showErrorCustom', $scope.customErrorDescription);
            });
        }];
    }
};
