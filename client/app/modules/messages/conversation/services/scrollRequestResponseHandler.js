'use strict';

module.exports = [function () {

    this.handlingResponse = function (newThreads, previousThreads) {
        newThreads.messages = previousThreads.concat(newThreads.messages);
    };

    this.checkRequestPinwall = function (threads, requestedNumberOfElements) {
        return threads.numberOfMessages > requestedNumberOfElements;
    };
}];
