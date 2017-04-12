'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Mitteilung',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
