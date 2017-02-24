'use strict';

let cdn = require('../../../cdn');
let tmp = require('tmp');
let _ = require('lodash');
let fs = require('fs');
let path = require('path');

let preProcessing = function (templateData, attachments) {
    let result = {attachments: _ .cloneDeep(attachments)}, imageData, userImage = tmp.fileSync({postfix: '.jpg'});
    result.subject = `Einladung von ${templateData.name}`;
    imageData = cdn.getObject(`profileImage/${templateData.userId}/profile.jpg`);
    fs.writeFileSync(userImage.name, imageData.Body);
    result.attachments.push({filename: path.basename(userImage.name), path: userImage.name, cid: 'url'});
    result.tempFiles = [userImage];
    return result;
};

module.exports = {
    preProcessing: preProcessing
};
