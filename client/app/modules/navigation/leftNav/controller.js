'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

            $scope.originalSection = [];

            $scope.setSections = function (selectedState) {
                $scope.sectionsDisply = [];
                angular.forEach($scope.originalSection, function (section) {
                    if(section.sref === selectedState) {
                        $scope.sectionsDisply.unshift(section);
                    } else {
                        $scope.sectionsDisply.push(section);
                    }
                });
            };

            $scope.goToState = function (selectedState) {
                $scope.setSections(selectedState);
                $state.go(selectedState);
            };

            $scope.$watch('sections', function (newSection) {
                if (newSection && !angular.equals(newSection, $scope.originalSection)) {
                    angular.copy(newSection, $scope.originalSection);
                    $scope.setSections($state.current.name);
                }
            });

            $scope.isFirst = function(first, color) {
                if(first) {
                    return {'background-color': color, 'color': '#fff' };
                }
                return {};
            };

            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                $scope.setSections(toState.name);
            });
        }];
    }
};
