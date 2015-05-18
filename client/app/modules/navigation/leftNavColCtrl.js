'use strict';

module.exports = ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope) {

        $scope.originalSection = [];

        $rootScope.$on('elyoos.leftNav.changed', function (event, sections) {
            if (!angular.equals(sections, $scope.originalSection)) {
                angular.copy(sections, $scope.originalSection);
                $scope.sections = sections;
            }
        });
    }];
