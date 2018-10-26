'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const NodeCache = require('node-cache');
const expiresAfterADay = 60 * 60 * 12;
const fs = require('fs');
const logger = require('./logging').getLogger(__filename);

const cache = new NodeCache({stdTTL: 10800, checkperiod: 3600});

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
    let params = {Bucket: process.env.BUCKET_PRIVATE, Key: path, Expires: expiresAfterADay},
        signedUrl = cache.get(path);
    if (!signedUrl) {
        try {
            signedUrl = await new Promise(function (resolve, reject) {
                s3.getSignedUrl('getObject', params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        cache.set(path, data);
                        resolve(data);
                    }
                });
            });
        }
        catch (error) {
            logger.error(`Getting Url ${path} from s3 failed`, null, error);
        }
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

const uploadBuffer = function (buffer, key, bucket) {
    return s3.putObject({
        Bucket: bucket, Key: key, Body: buffer
    }).promise();
};

const getPublicUrl = function (path, version) {
    let publicUrl = `${process.env.PUBLIC_IMAGE_BASE_URL}/${path}`;
    if (version) {
        publicUrl = publicUrl + `?v=${version}`;
    }
    return publicUrl;
};

const deleteFolder = async function (folderName, bucket) {

    let params = {Bucket: bucket, Prefix: folderName};
    const listedObjects = await s3.listObjectsV2(params).promise();

    if (listedObjects.Contents.length > 0) {
        const deleteParams = {Bucket: bucket, Delete: {Objects: []}};
        for (let content of listedObjects.Contents) {
            deleteParams.Delete.Objects.push({Key: content.Key});
        }
        await s3.deleteObjects(deleteParams).promise();
    }
};

const createFolderRegisterUser = async function (userId) {
    const privateBucket = process.env.BUCKET_PRIVATE;
    await Promise.all([copyFile('profileImage/default/profile.jpg', `profileImage/${userId}/profile.jpg`, privateBucket),
        copyFile('profileImage/default/profilePreview.jpg', `profileImage/${userId}/profilePreview.jpg`,
            privateBucket),
        copyFile('profileImage/default/thumbnail.jpg', `profileImage/${userId}/thumbnail.jpg`, privateBucket)]);
};

const getObject = function (path, bucket) {
    let params = {Bucket: bucket, Key: path};
    return s3.getObject(params).promise();
};

module.exports = {
    getSignedUrl,
    getPublicUrl,
    getUrl: function (arg) {
    },
    uploadFile,
    uploadBuffer,
    deleteFolder,
    copyFile,
    createFolderRegisterUser,
    getObject
};
