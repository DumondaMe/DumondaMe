'use strict';

module.exports = ['$scope', 'AddRemovePinwallElementService', '$mdMedia', 'PinwallHeightCalculator', 'PinwallColumnSelector',
    function ($scope, AddRemovePinwallElementService, $mdMedia, PinwallHeightCalculator, PinwallColumnSelector) {
        var ctrl = this;

        if (angular.isString(ctrl.breakpoint)) {
            ctrl.isBreakpoint = $mdMedia(ctrl.breakpoint);
        } else {
            ctrl.isBreakpoint = $mdMedia('gt-sm');
        }

        ctrl.$mdMedia = $mdMedia;

        $scope.$watchCollection('pinwall', function (newPinwall) {
            if (angular.isArray(newPinwall)) {
                AddRemovePinwallElementService.setPinwall(newPinwall);
                AddRemovePinwallElementService.setService(ctrl.addRemovePinwallElementService);
                PinwallHeightCalculator.setHeightPinwallElements(newPinwall);
                ctrl.columns = PinwallColumnSelector.getColumns(newPinwall, ctrl.recommendedUser.length);
            }
        });
    }];


