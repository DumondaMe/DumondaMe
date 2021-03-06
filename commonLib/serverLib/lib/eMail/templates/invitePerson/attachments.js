'use strict';

let path = require('path');

let getAttachments = function (templateData) {
    return {
        attachments: [{
            filename: path.basename(templateData.userImage.name),
            path: templateData.userImage.name,
            cid: 'url'
        }, {
            filename: 'urlVideoPreview.png',
            path: path.resolve(__dirname, 'img/urlVideoPreview.png'),
            cid: 'urlVideoPreview'
        }, {
            filename: 'DumondaMeLogo.png',
            path: path.resolve(__dirname, 'img/DumondaMeLogo.png'),
            cid: 'urlDumondaMeLogo'
        }],
        tempFiles: []
    };
};

module.exports = {
    getAttachments
};
