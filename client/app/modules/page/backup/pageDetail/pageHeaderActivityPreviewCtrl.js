'use strict';

module.exports = ['$scope', '$state',
    function ($scope, $state) {

        $scope.openDetail = function (pageId, label) {
            $state.go('page.detail', {
                label: label,
                pageId: pageId
            });
        };
    }];
