'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Profilbild',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
