'use strict';

module.exports = ['dateFormatter', 'FeedbackOverviewGroup', '$stateParams', 'ScrollRequest', 'FeedbackOverviewGroupResponseHandler', 'ElyModal',
    'FeedbackRecommendation', 'errorToast',
    function (dateFormatter, FeedbackOverviewGroup, $stateParams, ScrollRequest, FeedbackOverviewGroupResponseHandler, ElyModal,
              FeedbackRecommendation, errorToast) {
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

        if (angular.isObject(ctrl.commands)) {
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

        ctrl.recommendFeedback = function (feedback) {
            feedback.runningUpload = true;
            FeedbackRecommendation.save({feedbackId: feedback.feedbackId}, function () {
                feedback.recommendedByUser = true;
                feedback.numberOfRecommendations++;
                delete feedback.runningUpload;
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetreten!');
                delete feedback.runningUpload;
            });
        };
    }];


