'use strict';


module.exports = function ($scope, $element, $attrs, $ctrl) {
    $scope.step = {
        label: 'Kontakte auswählen',
        selected: false
    };
    $ctrl.addStep($scope.step);
};
