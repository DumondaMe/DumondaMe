'use strict';

module.exports = [function () {

    this.handlingResponse = function (newEvents, previousEvents) {
        newEvents.events = previousEvents.concat(newEvents.events);
    };

    this.checkRequestPinwall = function (events, requestedNumberOfElements) {
        return events.events.length === requestedNumberOfElements;
    };
}];
