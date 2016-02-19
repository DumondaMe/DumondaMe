'use strict';

module.exports = [function () {

    this.handlingResponse = function (newThreads, previousThreads) {
        newThreads.threads = previousThreads.concat(newThreads.threads);
    };

    this.checkRequestPinwall = function (threads, requestedNumberOfElements) {
        return threads.numberOfThreads === requestedNumberOfElements;
    };
}];
