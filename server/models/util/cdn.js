'use strict';

var logger = requireLogger.getLogger(__filename);
var AWS = require('aws-sdk');
var cdnConfig = require('./../../lib/cdn');
var expiresAfterADay = 60 * 60 * 12;
var Promise = require('bluebird');
var fs = require('fs');

AWS.config.region = 'eu-central-1';

var copyFile = function (source, destination, s3) {
    var params = {
        Bucket: cdnConfig.getConfig().bucket,
        CopySource: cdnConfig.getConfig().bucket + '/' + source,
        Key: destination
    };
    return new Promise(function (resolve, reject) {
        s3.copyObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

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
    },
    createFolderRegisterUser: function (userId) {
        var s3 = new AWS.S3();
        return copyFile('profileImage/default/profile.jpg', userId + '/profile.jpg', s3).then(function () {
            return copyFile('profileImage/default/profilePreview.jpg', userId + '/profilePreview.jpg', s3);
        }).then(function () {
            return copyFile('profileImage/default/thumbnail.jpg', userId + '/thumbnail.jpg', s3);
        });
    }
};
