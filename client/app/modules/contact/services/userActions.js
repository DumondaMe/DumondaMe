'use strict';

module.exports = ['$state', 'SearchThread', function ($state, SearchThread) {

    this.sendMessage = function (id) {
        var search = SearchThread.get({
            userId: id
        }, function () {
            if (search.hasExistingThread) {
                $state.go('message.threads.detail', {
                    threadId: search.threadId,
                    isGroupThread: false
                });
            } else {
                $state.go('message.threads.create', {
                    userId: id
                });
            }
        });
    };
}];
