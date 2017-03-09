'use strict';

let _ = require('lodash');
let path = require('path');

let preProcessing = function (templateData, attachments) {
    let result = {attachments: _ .cloneDeep(attachments)};
    result.subject = `Einladung von ${templateData.name}`;
    result.attachments.push({filename: path.basename(templateData.userImage.name), path: templateData.userImage.name, cid: 'url'});
    return result;
};

module.exports = {
    preProcessing: preProcessing
};
