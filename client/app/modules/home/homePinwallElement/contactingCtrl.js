'use strict';

module.exports = ['$scope', 'dateFormatter', '$state', function ($scope, dateFormatter, $state) {

    $scope.openDetail = function (userId) {
        if (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        }
    };

    $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
}];

