'use strict';

let image = require('./../images/uploadImageCDN');
let _ = require('underscore');

let uploadFile = function (filePath, pageId) {
    if (_.isString(filePath)) {
        return image.uploadImage(filePath, 'blog', pageId, 450, 1000);
    }
    return Promise.resolve(null);
};

module.exports = {
    uploadFile: uploadFile
};
