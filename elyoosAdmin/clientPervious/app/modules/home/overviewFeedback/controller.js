'use strict';

module.exports = ['OverviewFeedback', 'dateFormatter', 'ScrollRequest', 'OverviewFeedbackScrollRequestResponseHandler',
    function (OverviewFeedback, dateFormatter, ScrollRequest, OverviewFeedbackScrollRequestResponseHandler) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.loadOverviewFeedback = true;
        ctrl.overview = {feedback: []};

        ScrollRequest.reset('OverviewFeedback', OverviewFeedback.get, OverviewFeedbackScrollRequestResponseHandler);

        ctrl.nextFeedback = function () {
            ScrollRequest.nextRequest('OverviewFeedback', ctrl.overview.feedback).then(function (overview) {
                ctrl.loadOverviewFeedback = false;
                ctrl.overview = overview;
            });
        };
        ctrl.nextFeedback();
    }];
