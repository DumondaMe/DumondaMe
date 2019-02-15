'use strict';

let path = require('path');

let getAttachments = function (templateData) {
    return {
        attachments: [{
            filename: path.basename(templateData.userImage.name),
            path: templateData.userImage.name,
            cid: 'url'
        }],
        tempFiles: []
    };
};

module.exports = {
    getAttachments
};
