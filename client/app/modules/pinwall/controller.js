'use strict';

module.exports = ['$scope', 'PinwallBlogService', '$mdMedia', 'PinwallHeightCalculator', 'PinwallColumnSelector',
    function ($scope, PinwallBlogService, $mdMedia, PinwallHeightCalculator, PinwallColumnSelector) {
        var ctrl = this;

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


