'use strict';

module.exports = ['dateFormatter', 'FeedbackOverviewGroup', '$stateParams', 'ScrollRequest', 'FeedbackOverviewGroupResponseHandler', 'ElyModal',
    function (dateFormatter, FeedbackOverviewGroup, $stateParams, ScrollRequest, FeedbackOverviewGroupResponseHandler, ElyModal) {
        var ctrl = this, scrollName = 'feedbackOverviewGroup' + ctrl.status;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.feedbackGroupOverview = {feedbacks: []};
        ctrl.group = $stateParams.group;
        ctrl.loadRunning = true;

        ScrollRequest.reset(scrollName, FeedbackOverviewGroup.get, FeedbackOverviewGroupResponseHandler);
        ctrl.nextOverviewGroupOpen = function () {
            ScrollRequest.nextRequest(scrollName, ctrl.feedbackGroupOverview.feedbacks, {status: ctrl.status, group: $stateParams.group})
                .then(function (overview) {
                    ctrl.loadRunning = false;
                    ctrl.feedbackGroupOverview = overview;
                    ctrl.numberOfFeedback = ctrl.feedbackGroupOverview.statistic;
                });
        };
        ctrl.nextOverviewGroupOpen();

        if(angular.isObject(ctrl.commands)) {
            ctrl.commands.createFeedback = function () {
                ElyModal.show('FeedbackCreateCtrl', 'app/modules/feedback/modal/createFeedback/template.html',
                    {group: ctrl.group}).then(function (resp) {
                    ctrl.feedbackGroupOverview.feedbacks.unshift(resp);
                    ScrollRequest.addedElement(scrollName);
                    ctrl.feedbackGroupOverview.statistic.numberOfOpenFeedbacks++;
                });
            };
            ctrl.commands.nextOverviewGroupOpen = ctrl.nextOverviewGroupOpen;
        }
    }];


