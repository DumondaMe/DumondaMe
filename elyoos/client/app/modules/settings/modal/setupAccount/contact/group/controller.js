'use strict';

module.exports = ['$scope', 'Privacy', 'ContactStatisticTypes',
    function ($scope, Privacy, ContactStatisticTypes) {
        var ctrl = this;

        if ($scope.statistics && $scope.statistics.statistic && $scope.statistics.statistic.length > 0) {
            ctrl.selectedGroup = $scope.statistics.statistic[0];
        }

        ctrl.deleteGroup = function (groupName) {
            if ($scope.statistics.statistic.length > 1) {
                if (groupName === ctrl.selectedGroup.type) {
                    $scope.statistics.statistic.forEach(function (statistic) {
                        if (statistic.type !== groupName && ctrl.selectedGroup.type === groupName) {
                            ctrl.selectedGroup = statistic;
                        }
                    });
                }
                return Privacy.delete({
                    privacyDescription: groupName,
                    newPrivacyDescription: ctrl.selectedGroup.type
                }).$promise.then(function () {
                    ContactStatisticTypes.removeType(groupName);
                });
            }
        };

        $scope.$watch('statistics', function (newStatistics) {
            if (newStatistics && newStatistics.statistic && newStatistics.statistic.length > 0 && !ctrl.selectedGroup) {
                ctrl.selectedGroup = newStatistics.statistic[0];
            }
        });
    }];
