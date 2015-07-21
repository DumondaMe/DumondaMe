'use strict';

var resetPinwallElements = function ($scope) {
    $scope.pinwall1Elements = [];
    $scope.pinwall2Elements = [];
    $scope.pinwall3Elements = [];
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.$watchCollection('pinwall', function (newPinwall) {
                var i;
                if (newPinwall && newPinwall.hasOwnProperty('pinwall')) {
                    resetPinwallElements($scope);
                    if ($scope.numberOfRows === 1) {
                        $scope.pinwall1Elements = newPinwall.pinwall;
                    } else if ($scope.numberOfRows === 2) {
                        for (i = 0; i < newPinwall.pinwall.length; i++) {
                            if (i % 2 === 0) {
                                $scope.pinwall1Elements.push(newPinwall.pinwall[i]);
                            } else {
                                $scope.pinwall2Elements.push(newPinwall.pinwall[i]);
                            }
                        }
                    }
                }
            });
        }];
    }
};
