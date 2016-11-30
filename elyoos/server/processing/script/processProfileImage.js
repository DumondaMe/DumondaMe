'use strict';

var tmp = require('tmp');
var fs = require('fs');
var gm = require('gm');
var uploadFile = require('./uploadFile');
var logger = requireLogger.getLogger(__filename);

var createUploadProfileImage = function (downloadedFile, path, bucket, s3) {
    var thumbnail = tmp.fileSync({postfix: '.jpg'});
    gm(downloadedFile.name).thumbAsync(48, 48, thumbnail.name, 97).then(function () {
            return uploadFile.uploadFile(thumbnail.name, path + '/thumbnail.jpg', bucket, s3);
        }).then(function () {
        thumbnail.removeCallback();
        downloadedFile.removeCallback();
        logger.info(`Uploaded image ${path}`);
    });
};

var processProfileImage = function (key, bucket, s3) {
    var path = 'profileImage/' + key, original = path + '/profile.jpg';
    s3.getObject({Bucket: bucket, Key: original}, function (err, data) {
        var tmpFile;
        if (err) {
            return logger.error('Getting Object ' + original + 'failed', {}, err);
        }
        tmpFile = tmp.fileSync({postfix: '.jpg'});
        fs.writeFileSync(tmpFile.name, data.Body);
        createUploadProfileImage(tmpFile, path, bucket, s3);
    });
};

var processProfileImages = function (profileImages, bucket, s3) {
    var key;
    for (key in profileImages) {
        if (profileImages.hasOwnProperty(key)) {
            processProfileImage(key, bucket, s3);
        }
    }
};

module.exports = {
    processProfileImages: processProfileImages
};
