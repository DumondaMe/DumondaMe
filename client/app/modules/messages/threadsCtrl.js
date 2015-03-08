'use strict';

module.exports = ['$scope', '$state', 'Message', 'SearchUserToSendMessage', 'dateFormatter',
    function ($scope, $state, Message, SearchUserToSendMessage, dateFormatter) {

        var currentPagination = 1;
        $scope.itemsPerPage = 30;

        $scope.getThreads = function (paginationNumber) {
            currentPagination = paginationNumber;
            var skip = (paginationNumber - 1) * $scope.itemsPerPage;
            $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: skip});
        };
        $scope.getThreads(currentPagination);

        $scope.getFormattedDate = dateFormatter.format;

        $scope.openThread = function (threadId, isGroupThread) {
            if (threadId) {
                $state.go('message.threads.detail', {
                    threadId: threadId,
                    isGroupThread: isGroupThread
                });
            }
        };

        $scope.$on('message.changed', function () {
            $scope.getThreads(currentPagination);
        });

        $scope.getSuggestion = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                return SearchUserToSendMessage.query({
                    search: searchValue,
                    maxItems: 7,
                    isSuggestion: true
                }).$promise;
            }
            delete $scope.search;
        };

        $scope.getThreadsOrContacts = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.search = SearchUserToSendMessage.get({
                    search: searchValue,
                    maxItems: 20,
                    isSuggestion: false
                });
            } else {
                delete $scope.search;
            }
        };

        $scope.addNewSingleThread = function (userId) {
            if (userId) {
                $state.go('message.threads.create', {
                    userId: userId
                });
            }
        };
    }];
