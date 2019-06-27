'use strict';

module.exports = [function () {

    this.getCreateFeedbackCommentMessage = function (text, feedbackId) {
        return {
            text: text, feedbackId: feedbackId
        };
    };
}];
