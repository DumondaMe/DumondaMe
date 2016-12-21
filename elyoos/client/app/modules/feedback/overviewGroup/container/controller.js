'use strict';

module.exports = ['dateFormatter', 'FeedbackOverviewResourceHandler', '$stateParams', 'ScrollRequest', 'FeedbackOverviewGroupResponseHandler',
    'ElyModal', 'FeedbackRecommendation', 'errorToast',
    function (dateFormatter, FeedbackOverviewResourceHandler, $stateParams, ScrollRequest, FeedbackOverviewGroupResponseHandler, ElyModal,
              FeedbackRecommendation, errorToast) {
        var ctrl = this, scrollName = 'feedbackOverviewGroup' + ctrl.status;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.feedbackGroupOverview = {feedbacks: []};
        ctrl.group = $stateParams.group;
        ctrl.discussionId = $stateParams.discussionId;
        ctrl.loadRunning = true;

        ScrollRequest.reset(scrollName, FeedbackOverviewResourceHandler.getResource(ctrl.group).get, FeedbackOverviewGroupResponseHandler);
        ctrl.nextOverviewGroupOpen = function () {
            ScrollRequest.nextRequest(scrollName, ctrl.feedbackGroupOverview.feedbacks,
                FeedbackOverviewResourceHandler.getParams($stateParams.group, ctrl.status, $stateParams.discussionId))
                .then(function (overview) {
                    ctrl.loadRunning = false;
                    ctrl.feedbackGroupOverview = overview;
                    ctrl.numberOfFeedback = ctrl.feedbackGroupOverview.statistic;
                    if (ctrl.feedbackGroupOverview.hasOwnProperty('discussion')) {
                        ctrl.feedbackTitle = ctrl.feedbackGroupOverview.discussion.title;
                        ctrl.feedbackDescription = ctrl.feedbackGroupOverview.discussion.description;
                    }
                });
        };
        ctrl.nextOverviewGroupOpen();

        if (angular.isObject(ctrl.commands)) {
            ctrl.commands.createFeedback = function () {
                ElyModal.show('FeedbackManageCtrl', 'app/modules/feedback/modal/manageFeedback/template.html',
                    {data: {group: ctrl.group, feedbackId: $stateParams.discussionId}}).then(function (resp) {
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


