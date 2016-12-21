'use strict';

module.exports = ['$state', 'dateFormatter',
    function ($state, dateFormatter) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.openDetail = function (feedback) {
            if (feedback.type === 'Bug' || feedback.type === 'Idea' || feedback.type === 'DiscussionIdea') {
                $state.go('feedback.detail', {feedbackId: feedback.feedbackId});
            } else if(feedback.type === 'Discussion') {
                $state.go('feedback.discussion', {discussionId: feedback.feedbackId});
            }
        };
    }];
