'use strict';

var tmp = require('tmp');
var fs = require('fs');
var gm = require('gm');
var uploadFile = require('./uploadFile');
var logger = requireLogger.getLogger(__filename);


var createUploadBookImage = function (downloadedFile, path, bucket, s3) {
    var preview = tmp.fileSync({postfix: '.jpg'}),
        thumbnail = tmp.fileSync({postfix: '.jpg'}),
        sigma = 0.5, amount = 0.7, threshold = 0;
    gm(downloadedFile.name).resize(130).quality(90).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(preview.name)
        .then(function () {
            return gm(downloadedFile.name).resize(55).quality(90).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(thumbnail.name);
        }).then(function () {
        return uploadFile.uploadFile(preview.name, path + '/pagePreview.jpg', bucket, s3);
    }).then(function () {
        return uploadFile.uploadFile(thumbnail.name, path + '/thumbnail.jpg', bucket, s3);
    }).then(function () {
        preview.removeCallback();
        thumbnail.removeCallback();
        downloadedFile.removeCallback();
        logger.info(`Uploaded image ${path}`);
    });
};

var processBookImage = function (key, bucket, s3) {
    var path = 'pages/' + key, original = path + '/pageTitlePicture.jpg';
    s3.getObject({Bucket: bucket, Key: original}, function (err, data) {
        var tmpFile;
        if (err) {
            return logger.error('Getting Object ' + original + 'failed', {}, err);
        }
        tmpFile = tmp.fileSync({postfix: '.jpg'});
        fs.writeFileSync(tmpFile.name, data.Body);
        createUploadBookImage(tmpFile, path, bucket, s3);
    });
};

var processBookImages = function (books, bucket, s3) {
    var key;
    for (key in books) {
        if (books.hasOwnProperty(key)) {
            processBookImage(key, bucket, s3);
        }
    }
};

module.exports = {
    processBookImages: processBookImages
};
