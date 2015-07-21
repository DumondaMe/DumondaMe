'use strict';

var resetPinwallElements = function ($scope) {
    $scope.pinwall1Elements = [];
    $scope.pinwall2Elements = [];
    $scope.pinwall3Elements = [];
};

var addPinwallElementsToColumns = function ($scope, pinwall) {
    var i;
    if ($scope.numberOfRows === 1) {
        $scope.pinwall1Elements = pinwall;
    } else if ($scope.numberOfRows === 2) {
        for (i = 0; i < pinwall.length; i++) {
            if (i % 2 === 0) {
                $scope.pinwall1Elements.push(pinwall[i]);
            } else {
                $scope.pinwall2Elements.push(pinwall[i]);
            }
        }
    } else if ($scope.numberOfRows === 3) {
        for (i = 0; i < pinwall.length; i++) {
            if (i % 3 === 0) {
                $scope.pinwall1Elements.push(pinwall[i]);
            } else if (i % 3 === 1) {
                $scope.pinwall2Elements.push(pinwall[i]);
            } else {
                $scope.pinwall3Elements.push(pinwall[i]);
            }
        }
    }
};

var pinwall;

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.$watchCollection('pinwall', function (newPinwall) {
                if (newPinwall && newPinwall.hasOwnProperty('pinwall')) {
                    pinwall = newPinwall.pinwall;
                    resetPinwallElements($scope);
                    addPinwallElementsToColumns($scope, newPinwall.pinwall);
                }
            });

            $scope.$watch('numberOfRows', function (newNumberOfRows) {
                if (newNumberOfRows && pinwall) {
                    resetPinwallElements($scope);
                    addPinwallElementsToColumns($scope, pinwall);
                }
            });
        }];
    }
};
