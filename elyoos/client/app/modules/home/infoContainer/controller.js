'use strict';

module.exports = ['EventOverview', 'ScrollRequest', 'EventOverviewScrollRequestResponseHandler', '$document',
    function (EventOverview, ScrollRequest, EventOverviewScrollRequestResponseHandler, $document) {
        var ctrl = this;

        ctrl.scrollTop = 0;
        ctrl.totalScrollHeight = 0;
        ctrl.scrollHeight = 0;
        ctrl.events = {events: []};
        ctrl.requestRunning = true;

        ScrollRequest.reset('eventOverview', EventOverview.get, EventOverviewScrollRequestResponseHandler);

        ctrl.nextEvents = function () {
            ctrl.noEvents = false;
            ScrollRequest.nextRequest('eventOverview', ctrl.events.events).then(function (events) {
                ctrl.requestRunning = false;
                ctrl.events = events;
                if(ctrl.events.events.length === 0) {
                    ctrl.noEvents = true;
                }
            });
        };

        ctrl.nextEvents();

        ctrl.setHeightColumn = function (height) {
            ctrl.scrollHeight = height;
        };

        ctrl.setTotalHeightColumn = function (height) {
            ctrl.totalScrollHeight = height;
        };

        ctrl.setScrollPosition = function (scrollTop, height) {
            ctrl.scrollTop = scrollTop;
            ctrl.totalScrollHeight = height;
        };

        ctrl.buttonNextEvents = function () {
            angular.element($document[0].querySelector('#ely-home-info-content-inner-container'))
                .duScrollTo(0, ctrl.scrollTop + ctrl.scrollHeight, 400);
        };

        ctrl.buttonPreviousEvents = function () {
            angular.element($document[0].querySelector('#ely-home-info-content-inner-container'))
                .duScrollTo(0, ctrl.scrollTop - ctrl.scrollHeight, 400);
        };
    }];

