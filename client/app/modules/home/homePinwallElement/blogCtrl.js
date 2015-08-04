'use strict';

module.exports = ['$scope', 'dateFormatter', function ($scope, dateFormatter) {

    $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
}];

