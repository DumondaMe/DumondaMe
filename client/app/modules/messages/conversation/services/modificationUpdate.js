'use strict';

var getModificationToThread = function (threadId, modifications) {
    var modificationToThread = null;
    angular.forEach(modifications, function (modification) {
        if (modification.threadId === threadId) {
            modificationToThread = modification;
        }
    });
    return modificationToThread;
};

var getConversation = function (Conversation, modification, threadId, deferred) {
    var update = Conversation.get({skip: 0, maxItems: modification.numberOfUnreadMessages, threadId: threadId}, function () {
        deferred.resolve(update);
    }, function () {
        deferred.reject();
    });
};

module.exports = ['$q', 'Conversation', function ($q, Conversation) {

    this.update = function (threadId, modifications) {
        var modification, deferred = $q.defer();
        if (angular.isString(threadId) && angular.isArray(modifications)) {
            modification = getModificationToThread(threadId, modifications);
            if (modification) {
                getConversation(Conversation, modification, threadId, deferred);
            } else {
                deferred.resolve();
            }
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    };
}];
