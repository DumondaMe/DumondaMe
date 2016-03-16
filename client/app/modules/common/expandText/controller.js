'use strict';

module.exports = ['$scope', 'PreviewTextService', function ($scope, PreviewTextService) {

    var ctrl = this;

    ctrl.expanded = false;
    ctrl.expand = function () {
        ctrl.expanded = true;
        ctrl.showText = $scope.description;
    };

    ctrl.showText = PreviewTextService.getPreviewText($scope.description, ctrl.length);

    $scope.$watch('description', function (description) {
        if (!ctrl.expanded) {
            ctrl.showText = PreviewTextService.getPreviewText(description, ctrl.length);
        }
    });
}];
