'use strict';

let _ = require('underscore');

let getFeedbackType = function (label) {
    let type = null;
    if (_.contains(label, 'Bug')) {
        type = 'Bug';
    } else if (_.contains(label, 'Idea')) {
        type = 'Idea';
    } else if (_.contains(label, 'Discussion')) {
        type = 'Discussion';
    } else if (_.contains(label, 'DiscussionIdea')) {
        type = 'DiscussionIdea';
    }
    return type;
};

module.exports = {
    getFeedbackType: getFeedbackType
};
