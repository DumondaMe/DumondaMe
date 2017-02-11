'use strict';

let preProcessing = function (templateData, attachments) {
    let result = {attachments: attachments}, status = templateData.status === 'closed' ? 'geschlossen' : 'geöffnet';
    result.subject = `${templateData.userChangedStatusFeedback} hat "${templateData.titleFeedback}" ${status}`;
    return result;
};

module.exports = {
    preProcessing: preProcessing
};
