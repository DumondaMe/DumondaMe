'use strict';

var AWS = require('aws-sdk');
var cdnConfig = require('./../../lib/cdn');
var expiresAfterADay = 60 * 60 * 12;
var Promise = require('bluebird');
var fs = require('fs');
var _ = require('underscore');

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
    uploadFile: function (fileName, key) {
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
    deleteFolder: function (folderName) {
        var s3 = new AWS.S3(), params;

        return new Promise(function (resolve, reject) {
            params = {Bucket: cdnConfig.getConfig().bucket, Prefix: folderName};
            s3.listObjects(params, function (err, data) {
                if (err) {
                    return reject(err);
                }
                params = {Bucket: cdnConfig.getConfig().bucket};
                params.Delete = {};
                params.Delete.Objects = [];
                _.each(data.Contents, function (content) {
                    params.Delete.Objects.push({Key: content.Key});
                });
                s3.deleteObjects(params, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            });
        });
    },
    copyFile: function (source, destination) {
        var s3 = new AWS.S3();
        return copyFile(source, destination, s3);
    },
    createFolderRegisterUser: function (userId) {
        var s3 = new AWS.S3();
        return copyFile('profileImage/default/profile.jpg', 'profileImage/' + userId + '/profile.jpg', s3).then(function () {
            return copyFile('profileImage/default/profilePreview.jpg', 'profileImage/' + userId + '/profilePreview.jpg', s3);
        }).then(function () {
            return copyFile('profileImage/default/thumbnail.jpg', 'profileImage/' + userId + '/thumbnail.jpg', s3);
        });
    }
};
