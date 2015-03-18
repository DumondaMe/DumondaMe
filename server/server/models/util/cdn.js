'use strict';

var logger = requireLogger.getLogger(__filename);
var AWS = require('aws-sdk');
var cdnConfig = require('./../../../common/src/lib/cdn');
var expiresAfterADay = 60 * 60 * 24;
var Promise = require('bluebird');
var fs = require('fs');

AWS.config.region = 'eu-central-1';

module.exports = {
    getUrl: function (path) {
        var s3 = new AWS.S3(),
            params = {
                Bucket: cdnConfig.getConfig().bucket,
                Key: path,
                Expires: expiresAfterADay
            };
        return s3.getSignedUrl('getObject', params);
    },
    uploadProfilePicture: function (fileName, key) {
        var s3 = new AWS.S3({params: {Bucket: cdnConfig.getConfig().bucket, Key: key}});

        return new Promise(function (resolve, reject) {
            s3.upload({Body: fs.createReadStream(fileName)})
                .send(function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
        });
    }
};
