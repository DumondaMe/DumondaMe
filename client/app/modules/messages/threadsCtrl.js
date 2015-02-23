'use strict';

module.exports = ['$scope', 'Message', 'dateFormatter', function ($scope, Message, dateFormatter) {

    $scope.itemsPerPage = 10;

    $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: 0});

    $scope.getFormattedDate = function (dateValue) {
        return dateFormatter.format(dateValue);
    };
}];
