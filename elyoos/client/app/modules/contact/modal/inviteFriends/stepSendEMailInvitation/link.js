'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Versenden',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
