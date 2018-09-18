'use strict';

module.exports = [function () {

    this.getDiscussionMessage = function (isEditMode, title, description, feedbackId) {
        if (isEditMode) {
            return {title: title, description: description, discussionId: feedbackId};
        }
        return {title: title, description: description};
    };
}];
