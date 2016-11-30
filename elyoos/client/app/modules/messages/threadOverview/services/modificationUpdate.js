'use strict';

var compare = function (a, b) {
    return b.lastUpdate - a.lastUpdate;
};

module.exports = [function () {

    this.update = function (threads, modifications) {
        if (angular.isArray(threads) && angular.isArray(modifications)) {

            angular.forEach(modifications, function (modification) {
                var isExisting = false;
                angular.forEach(threads, function (thread) {
                    if (modification.threadId === thread.threadId) {
                        isExisting = true;
                        thread.previewText = modification.previewText;
                        thread.lastUpdate = modification.lastUpdate;
                        thread.numberOfUnreadMessages = modification.numberOfUnreadMessages;
                    }
                });
                if (!isExisting) {
                    threads.unshift(modification);
                }
            });
            threads.sort(compare);
        }
    };
}];
