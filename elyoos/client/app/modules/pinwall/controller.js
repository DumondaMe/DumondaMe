'use strict';

module.exports = ['$scope', 'PinwallBlogService', '$mdMedia', 'PinwallHeightCalculator', 'PinwallColumnSelector',
    function ($scope, PinwallBlogService, $mdMedia, PinwallHeightCalculator, PinwallColumnSelector) {
        var ctrl = this;

        if (angular.isString(ctrl.breakpoint)) {
            ctrl.isBreakpoint = $mdMedia(ctrl.breakpoint);
        } else {
            ctrl.isBreakpoint = $mdMedia('gt-sm');
        }

        ctrl.$mdMedia = $mdMedia;

        $scope.$watchCollection('pinwall', function (newPinwall) {
            if (angular.isArray(newPinwall)) {
                PinwallBlogService.addPinwall(newPinwall);
                PinwallHeightCalculator.setHeightPinwallElements(newPinwall);
                ctrl.columns = PinwallColumnSelector.getColumns(newPinwall);
            }
        });
    }];


