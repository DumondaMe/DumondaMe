'use strict';

module.exports = [function () {

    this.getDiscussionMessage = function (isEditMode, title, description, feedbackId) {
        if (isEditMode) {
            return {title: title, description: description};
        }
        return {title: title, description: description, feedbackId: feedbackId};
    };
}];
