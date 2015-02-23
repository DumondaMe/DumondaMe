'use strict';

var moment = require('moment');

module.exports = ['$scope', 'Message', function ($scope, Message) {

    $scope.itemsPerPage = 10;

    $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: 0});
}];
