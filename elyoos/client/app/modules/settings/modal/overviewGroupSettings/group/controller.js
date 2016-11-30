'use strict';

module.exports = ['$scope', 'PrivacyPublicCheckService',
    function ($scope, PrivacyPublicCheckService) {
        var ctrl = this;

        ctrl.isPublic = PrivacyPublicCheckService.isPublic($scope.group);

        $scope.$watchCollection('group', function (newGroup) {
            ctrl.isPublic = PrivacyPublicCheckService.isPublic(newGroup);
        });
    }];

