'use strict';

module.exports = ['FeedbackOverviewGroup', '$stateParams', 'ScrollRequest', 'FeedbackOverviewGroupResponseHandler', 'ElyModal',
    function (FeedbackOverviewGroup, $stateParams, ScrollRequest, FeedbackOverviewGroupResponseHandler, ElyModal) {
        var ctrl = this;
        ctrl.feedbackGroupOverview = {feedbacks: []};
        ctrl.group = $stateParams.group;

        ScrollRequest.reset('feedbackOverviewGroup', FeedbackOverviewGroup.get, FeedbackOverviewGroupResponseHandler);

        ctrl.nextOverviewGroup = function () {
            ScrollRequest.nextRequest('feedbackOverviewGroup', ctrl.feedbackGroupOverview.feedbacks, {status: 'open', group: $stateParams.group})
                .then(function (overview) {
                    ctrl.feedbackGroupOverview = overview;
                });
        };

        ctrl.nextOverviewGroup();

        ctrl.createFeedback = function () {
            ElyModal.show('FeedbackCreateCtrl', 'app/modules/feedback/modal/createFeedback/template.html',
                {group: ctrl.group}).then(function (resp) {
                ctrl.feedbackGroupOverview.feedbacks.unshift(resp);
                ScrollRequest.addedElement('feedbackOverviewGroup');
            });
        };
    }];


