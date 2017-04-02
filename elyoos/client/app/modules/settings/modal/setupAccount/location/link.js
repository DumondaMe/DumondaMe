'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Standort',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
