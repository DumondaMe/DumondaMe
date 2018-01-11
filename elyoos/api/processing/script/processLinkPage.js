'use strict';

var tmp = require('tmp');
var fs = require('fs');
var gm = require('gm');
var uploadFile = require('./uploadFile');
var logger = requireLogger.getLogger(__filename);

var createUploadLinkImage = function (downloadedFile, path, bucket, s3) {
    var preview = tmp.fileSync({postfix: '.jpg'}),
        thumbnail = tmp.fileSync({postfix: '.jpg'}),
        sigma = 0.5, amount = 0.7, threshold = 0;
    gm(downloadedFile.name).resize(450).quality(80).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(preview.name)
        .then(function () {
            return gm(downloadedFile.name).resize(64).quality(90).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(thumbnail.name);
        }).then(function () {
        return uploadFile.uploadFile(preview.name, path + '/preview.jpg', bucket, s3);
    }).then(function () {
        return uploadFile.uploadFile(thumbnail.name, path + '/thumbnail.jpg', bucket, s3);
    }).then(function () {
        preview.removeCallback();
        thumbnail.removeCallback();
        downloadedFile.removeCallback();
        logger.info(`Uploaded image ${path}`);
    });
};

var processLinkImage = function (key, bucket, s3) {
    var path = 'pages/' + key, original = path + '/normal.jpg';
    s3.getObject({Bucket: bucket, Key: original}, function (err, data) {
        var tmpFile;
        if (err) {
            return logger.error('Getting Object ' + original + 'failed', {}, err);
        }
        tmpFile = tmp.fileSync({postfix: '.jpg'});
        fs.writeFileSync(tmpFile.name, data.Body);
        createUploadLinkImage(tmpFile, path, bucket, s3);
    });
};

var processLinkImages = function (links, bucket, s3) {
    var key;
    for (key in links) {
        if (links.hasOwnProperty(key)) {
            processLinkImage(key, bucket, s3);
        }
    }
};

module.exports = {
    processLinkImages: processLinkImages
};
