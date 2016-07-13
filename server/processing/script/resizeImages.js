'use strict';

var AWS = require('aws-sdk');
var logger = requireLogger.getLogger(__filename);
var processBookPage = require('./processBookPage');
var processLinkPage = require('./processLinkPage');
var pageParser = require('./pageParser');

var bucket = 'elyoos.test';

AWS.config.region = 'eu-central-1';
var s3 = new AWS.S3();

var resize = function () {
    s3.listObjectsV2({Bucket: bucket, EncodingType: 'url', Prefix: 'pages/'}, function (err, data) {
        if (err) {
            return logger.error('List Objects failed', {}, err);
        }
        var pages = pageParser.getPages(data.Contents);
        processBookPage.processBookImages(pages.book, bucket, s3);
        processLinkPage.processLinkImages(pages.link, bucket, s3);
    });
};

module.exports = {
    resize: resize
};
