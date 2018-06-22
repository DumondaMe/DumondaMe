'use strict';

module.exports = [function () {

    this.createFeedbackCommentMessage = function (text, feedbackId) {
        return {
            text: text, feedbackId: feedbackId
        };
    };
}];
