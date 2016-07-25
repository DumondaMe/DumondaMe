'use strict';

var AWS = require('aws-sdk');
var cdnConfig = require('./../../lib/cdn');
var expiresAfterADay = 60 * 60 * 12;
var Promise = require('bluebird');
var fs = require('fs');
var _ = require('underscore');
var deasync = require('deasync');

if ('production' === process.env.NODE_ENV) {
    AWS.config.credentials = new AWS.EC2MetadataCredentials({
        httpOptions: {timeout: 10000}
    });
}
AWS.config.region = 'eu-central-1';
var s3 = new AWS.S3();

var copyFile = function (source, destination) {
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
        var params = {
            Bucket: cdnConfig.getConfig().bucket,
            Key: path,
            Expires: expiresAfterADay
        }, done = false, signedUrl = null;
        s3.getSignedUrl('getObject', params, function (err, generatedUrl) {
            signedUrl = generatedUrl;
            done = true;
        });
        deasync.loopWhile(function(){return !done;});
        return signedUrl;
    },
    uploadFile: function (fileName, key) {
        return new Promise(function (resolve, reject) {
            var params = {
                Bucket: cdnConfig.getConfig().bucket, Key: key, Body: fs.createReadStream(fileName)
            };
            s3.upload(params)
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
        return new Promise(function (resolve, reject) {
            var params = {Bucket: cdnConfig.getConfig().bucket, Prefix: folderName};
            s3.listObjects(params, function (err, data) {
                if (err) {
                    return reject(err);
                }
                if (data.Contents.length > 0) {
                    params = {Bucket: cdnConfig.getConfig().bucket};
                    params.Delete = {};
                    params.Delete.Objects = [];
                    _.each(data.Contents, function (content) {
                        params.Delete.Objects.push({Key: content.Key});
                    });
                    s3.deleteObjects(params, function (errDelete) {
                        if (errDelete) {
                            return reject(errDelete);
                        }
                        return resolve();
                    });
                } else {
                    return resolve();
                }
            });
        });
    },
    copyFile: function (source, destination) {
        return copyFile(source, destination);
    },
    createFolderRegisterUser: function (userId) {
        return copyFile('profileImage/default/profile.jpg', 'profileImage/' + userId + '/profile.jpg').then(function () {
            return copyFile('profileImage/default/profilePreview.jpg', 'profileImage/' + userId + '/profilePreview.jpg');
        }).then(function () {
            return copyFile('profileImage/default/thumbnail.jpg', 'profileImage/' + userId + '/thumbnail.jpg');
        });
    }
};
