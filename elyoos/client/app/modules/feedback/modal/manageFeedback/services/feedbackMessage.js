'use strict';

module.exports = [function () {

    this.getCreateFeedbackMessage = function (isChangeMode, title, description, group, feedbackId) {
        if(isChangeMode) {
            return {title: title, description: description, feedbackId: feedbackId};
        } else if (group === 'Bug' || group === 'Idea') {
            return {
                normal: {title: title, description: description, group: group}
            };
        }
    };
}];
