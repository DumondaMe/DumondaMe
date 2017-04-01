'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Privatsphäre',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
