'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                query: '=',
                getUserSuggestion: '=',
                getUser: '='
            },
            templateUrl: 'app/modules/directives/searchBox/template.html',
            controller: function ($scope) {
                $scope.sendGetUser = function ($event) {
                    if ($event.keyCode === 13) {
                        $scope.getUser($scope.query);
                    }
                };

                $scope.$on('$typeahead.select', function (value, index) {
                    $scope.getUser(index);
                });
            }
        };
    }],
    name: 'elySearchBox'
};
