'use strict';

module.exports = [function () {

    this.createFeedbackMessage = function (isEditMode, group, feedbackId, title, description, screen, operatingSystem, browser) {
        var message = null;
        if (isEditMode) {
            if (group === 'Bug') {
                message = {
                    title: title, description: description, screen: screen, operatingSystem: operatingSystem, browser: browser,
                    feedbackId: feedbackId
                };
            } else {
                message = {title: title, description: description, feedbackId: feedbackId};
            }
        } else {
            if (group === 'Bug') {
                message = {title: title, description: description, screen: screen, operatingSystem: operatingSystem, browser: browser};
            } else if (group === 'Idea') {
                message = {title: title, description: description};
            } else if (group === 'DiscussionIdea') {
                message = {title: title, description: description, discussionId: feedbackId};
            }
        }
        return message;
    };
}];
