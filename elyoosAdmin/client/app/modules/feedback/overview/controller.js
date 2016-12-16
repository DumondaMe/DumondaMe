'use strict';

module.exports = ['OverviewFeedbackDetail', 'dateFormatter', 'ScrollRequest', 'OverviewFeedbackDetailScrollRequestResponseHandler',
    function (OverviewFeedbackDetail, dateFormatter, ScrollRequest, OverviewFeedbackDetailScrollRequestResponseHandler) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.overview = {feedback: []};
        ctrl.status = 'open';
        ctrl.statusPrevious = ctrl.status;
        ctrl.order = 'newestModification';
        ctrl.orderPrevious = ctrl.order;
        ctrl.type = 'all';
        ctrl.typePrevious = ctrl.type;

        ScrollRequest.reset('OverviewFeedbackDetail', OverviewFeedbackDetail.get, OverviewFeedbackDetailScrollRequestResponseHandler);

        ctrl.nextFeedback = function () {
            ScrollRequest.nextRequest('OverviewFeedbackDetail', ctrl.overview.feedback, {type: ctrl.type, status: ctrl.status, order: ctrl.order})
                .then(function (feedback) {
                    ctrl.overview = feedback;
                });
        };

        ctrl.initNextFeedback = function () {
            ScrollRequest.reset('OverviewFeedbackDetail', OverviewFeedbackDetail.get, OverviewFeedbackDetailScrollRequestResponseHandler);
            ctrl.nextFeedback();
        };

        ctrl.initNextFeedback();

        ctrl.filterChanged = function () {
            if (ctrl.status !== ctrl.statusPrevious || ctrl.order !== ctrl.orderPrevious || ctrl.type !== ctrl.typePrevious) {
                ctrl.statusPrevious = ctrl.status;
                ctrl.orderPrevious = ctrl.order;
                ctrl.typePrevious = ctrl.type;
                ctrl.initNextFeedback();
            }
        };
    }];
