'use strict';

let AWS = require('aws-sdk');
let expiresAfterADay = 60 * 60 * 12;
let deasync = require('deasync');

if ('production' === process.env.NODE_ENV || 'development' === process.env.NODE_ENV) {
    AWS.config.credentials = new AWS.EC2MetadataCredentials({
        httpOptions: {timeout: 10000}
    });
}
AWS.config.region = 'eu-central-1';
let s3 = new AWS.S3();


module.exports = {
    getUrl: function (path, bucket) {
        let params = {
            Bucket: bucket,
            Key: path,
            Expires: expiresAfterADay
        }, done = false, signedUrl = null;
        s3.getSignedUrl('getObject', params, function (err, generatedUrl) {
            signedUrl = generatedUrl;
            done = true;
        });
        deasync.loopWhile(function () {
            return !done;
        });
        return signedUrl;
    }
};