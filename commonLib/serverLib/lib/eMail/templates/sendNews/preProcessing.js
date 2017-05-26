'use strict';

let _ = require('lodash');

let preProcessing = function (templateData, attachments) {
    let result = {attachments: _ .cloneDeep(attachments)};
    result.subject = `${templateData.title}`;
    return result;
};

module.exports = {
    preProcessing: preProcessing
};
