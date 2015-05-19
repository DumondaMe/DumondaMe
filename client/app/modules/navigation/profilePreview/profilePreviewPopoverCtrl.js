'use strict';

module.exports = ['$scope', '$state',
    function ($scope, $state) {

        $scope.openProfileEdit = function (hide) {
            $state.go('settings.profile');
            hide();
        };
    }];
