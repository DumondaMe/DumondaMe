'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const expiresAfterADay = 60 * 60 * 12;
const fs = require('fs');
const _ = require('underscore');
const deasync = require('deasync');
const logger = require('./logging').getLogger(__filename);

if ('production' === process.env.NODE_ENV || 'development' === process.env.NODE_ENV) {
    AWS.config.credentials = new AWS.EC2MetadataCredentials({
        httpOptions: {timeout: 10000}
    });
}
AWS.config.region = process.env.AWS_REGION;
const s3 = new AWS.S3();

let copyFile = function (source, destination, bucket) {
    let params = {Bucket: bucket, CopySource: `${bucket}/${source}`, Key: destination};
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

const getSignedUrl = async function (path) {
    let params = {Bucket: process.env.BUCKET_PRIVATE, Key: path, Expires: expiresAfterADay}, signedUrl = null;
    try {
        signedUrl = await new Promise(function (resolve, reject) {
            s3.getSignedUrl('getObject', params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    catch (error) {
        logger.error(`Getting Url ${path} from s3 failed`, null, error);
    }
    return signedUrl;
};

const uploadFile = function (fileName, key, bucket) {
    return new Promise(function (resolve, reject) {
        let params = {
            Bucket: bucket, Key: key, Body: fs.createReadStream(fileName)
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
};

const getPublicUrl = function (path) {
    return `${process.env.PUBLIC_IMAGE_BASE_URL}/${path}`;
};

const deleteFolder = function (folderName, bucket) {
    return new Promise(function (resolve, reject) {
        let params = {Bucket: bucket, Prefix: folderName};
        s3.listObjects(params, function (err, data) {
            if (err) {
                return reject(err);
            }
            if (data.Contents.length > 0) {
                params = {Bucket: bucket};
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
};

const createFolderRegisterUser = async function (userId) {
    const privateBucket = process.env.BUCKET_PRIVATE;
    await Promise.all([copyFile('profileImage/default/profile.jpg', `profileImage/${userId}/profile.jpg`, privateBucket),
        copyFile('profileImage/default/profilePreview.jpg', `profileImage/${userId}/profilePreview.jpg`,
            privateBucket),
        copyFile('profileImage/default/thumbnail.jpg', `profileImage/${userId}/thumbnail.jpg`, privateBucket)]);
};

const getObject = function (path, bucket) {
    let params = {Bucket: bucket, Key: path}, done = false, result = null;
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
};

module.exports = {
    getSignedUrl,
    getPublicUrl,
    getUrl: function (arg) {
    },
    uploadFile,
    deleteFolder,
    copyFile,
    createFolderRegisterUser,
    getObject
};
