'use strict';

let preProcessing = function (templateData, attachments) {
    let result = {attachments: attachments};
    result.subject = `${templateData.userCommentName} hat einen Kommentar zu "${templateData.titleFeedback}" geschrieben`;
    return result;
};

module.exports = {
    preProcessing: preProcessing
};
