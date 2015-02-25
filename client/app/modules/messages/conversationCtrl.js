'use strict';

module.exports = ['$scope', '$stateParams', 'Conversation', 'dateFormatter', function ($scope, $stateParams, Conversation, dateFormatter) {
    $scope.thread = Conversation.get({itemsPerPage: 10, skip: 0, threadId: $stateParams.threadId});

    $scope.getFormattedDate = dateFormatter.format;
}];
