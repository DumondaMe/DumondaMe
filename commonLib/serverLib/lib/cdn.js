'use strict';

let AWS = require('aws-sdk');
let cdnConfig = require('./cdnConfig');
let expiresAfterADay = 60 * 60 * 12;
let Promise = require('bluebird');
let fs = require('fs');
let _ = require('underscore');
let deasync = require('deasync');
let logger = require('./logging').getLogger(__filename);

if ('production' === process.env.NODE_ENV || 'development' === process.env.NODE_ENV) {
    AWS.config.credentials = new AWS.EC2MetadataCredentials({
        httpOptions: {timeout: 10000}
    });
}
AWS.config.region = 'eu-central-1';
let s3 = new AWS.S3();

let copyFile = function (source, destination) {
    let params = {
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
        let params = {
            Bucket: cdnConfig.getConfig().bucket,
            Key: path,
            Expires: expiresAfterADay
        }, done = false, signedUrl = null;
        s3.getSignedUrl('getObject', params, function (err, generatedUrl) {
            if (err) {
                logger.error(`Getting Url ${path} from s3 failed`, null, err);
            }
            signedUrl = generatedUrl;
            done = true;
        });
        deasync.loopWhile(function () {
            return !done;
        });
        return signedUrl;
    },
    uploadFile: function (fileName, key) {
        return new Promise(function (resolve, reject) {
            let params = {
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
            let params = {Bucket: cdnConfig.getConfig().bucket, Prefix: folderName};
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
    },
    getObject: function (path) {
        let params = {
            Bucket: cdnConfig.getConfig().bucket,
            Key: path
        }, done= false, result = null;
        s3.getObject(params, function (err, data) {
            if (err) {
                logger.error(`Getting Object ${path} from s3 failed`, null, err);
            }
            result = data;
            done = true;
        });
        deasync.loopWhile(function () {
            return !done;
        });
        return result;
    }
};
