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

        ctrl.blogRemoved = function (blogId) {
            PinwallBlogService.removeBlog($scope.pinwall, blogId);
        };

        $scope.$watchCollection('pinwall', function (newPinwall) {
            if (angular.isArray(newPinwall)) {
                PinwallHeightCalculator.setHeightPinwallElements(newPinwall);
                ctrl.columns = PinwallColumnSelector.getColumns(newPinwall);
            }
        });
    }];


