'use strict';

module.exports = ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $http({method: 'GET', url: '/api/user/page'})
        .then(function (data) {
            $scope.mySites = data.data;
        });

    $scope.newPage = function () {
        $state.go('page.myPage.new');
    };
}];
