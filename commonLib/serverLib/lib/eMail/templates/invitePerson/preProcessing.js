'use strict';

let preProcessing = function (templateData, attachments) {
    let result = {};
    result.attachments = attachments;
    result.subject = `Einladung von ${templateData.name}`;
    return result;
};

module.exports = {
    preProcessing: preProcessing
};
