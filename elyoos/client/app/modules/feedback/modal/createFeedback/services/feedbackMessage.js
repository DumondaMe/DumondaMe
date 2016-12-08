'use strict';

module.exports = [function () {

    this.getCreateFeedbackMessage = function (title, description, group) {
        if (group === 'Bug' || group === 'Idea') {
            return {
                normal: {title: title, description: description, group: group}
            };
        }
    };
}];
