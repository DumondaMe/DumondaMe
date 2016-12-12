'use strict';

module.exports = ['FeedbackOverviewGroup', 'FeedbackOverviewDiscussionIdea', function (FeedbackOverviewGroup, FeedbackOverviewDiscussionIdea) {

    this.getResource = function (group) {
        if(group === 'DiscussionIdea') {
            return FeedbackOverviewDiscussionIdea;
        }
        return FeedbackOverviewGroup;
    };

    this.getParams = function (group, status, discussionId) {
        if(group === 'DiscussionIdea') {
            return {status: status, discussionId: discussionId};
        }
        return {status: status, group: group};
    };
}];
