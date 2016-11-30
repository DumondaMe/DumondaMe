'use strict';

var AWS = require('aws-sdk');
var logger = requireLogger.getLogger(__filename);
var processBookPage = require('./processBookPage');
var processLinkPage = require('./processLinkPage');
var processProfileImage = require('./processProfileImage');
var pageParser = require('./pageParser');
var profileImageParser = require('./profileImageParser');

var bucket = 'elyoos.test';

AWS.config.region = 'eu-central-1';
var s3 = new AWS.S3();

var processPages = function () {
    s3.listObjectsV2({Bucket: bucket, EncodingType: 'url', Prefix: 'pages/'}, function (err, data) {
        if (err) {
            return logger.error('List Objects failed', {}, err);
        }
        var pages = pageParser.getPages(data.Contents);
        processBookPage.processBookImages(pages.book, bucket, s3);
        processLinkPage.processLinkImages(pages.link, bucket, s3);
    });
};

var processProfileImages = function () {
    s3.listObjectsV2({Bucket: bucket, EncodingType: 'url', Prefix: 'profileImage/'}, function (err, data) {
        if (err) {
            return logger.error('List Objects failed', {}, err);
        }
        var images = profileImageParser.getProfileImages(data.Contents);
        processProfileImage.processProfileImages(images, bucket, s3);
    });
};

var resize = function () {
    processPages();
    processProfileImages();
};

module.exports = {
    resize: resize
};
