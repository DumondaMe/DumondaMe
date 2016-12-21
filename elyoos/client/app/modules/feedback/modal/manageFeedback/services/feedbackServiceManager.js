'use strict';

module.exports = ['FeedbackCreateBug', 'FeedbackCreateIdea', 'FeedbackCreateDiscussionIdea', 'FeedbackEditBug', 'FeedbackEditIdea',
    function (FeedbackCreateBug, FeedbackCreateIdea, FeedbackCreateDiscussionIdea, FeedbackEditBug, FeedbackEditIdea) {

        this.getService = function (idEditMode, group) {
            var service = null;
            if (idEditMode) {
                if (group === 'Bug') {
                    service = FeedbackEditBug;
                } else if (group === 'Idea' || group === 'DiscussionIdea') {
                    service = FeedbackEditIdea;
                }
            } else {
                if (group === 'Bug') {
                    service = FeedbackCreateBug;
                } else if (group === 'Idea') {
                    service = FeedbackCreateIdea;
                } else if (group === 'DiscussionIdea') {
                    service = FeedbackCreateDiscussionIdea;
                }
            }
            return service;
        };
    }];
