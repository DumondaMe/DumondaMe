'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Willkommen',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
