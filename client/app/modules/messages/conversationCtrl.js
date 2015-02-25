'use strict';

module.exports = ['$scope', '$stateParams', 'Conversation', 'dateFormatter', function ($scope, $stateParams, Conversation, dateFormatter) {
    $scope.thread = Conversation.get({itemsPerPage: 10, skip: 0, threadId: $stateParams.threadId, isGroupThread: $stateParams.isGroupThread});

    $scope.getFormattedDate = dateFormatter.format;
}];
