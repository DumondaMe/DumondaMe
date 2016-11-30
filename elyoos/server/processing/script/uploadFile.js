'use strict';

var fs = require('fs');

var uploadFile = function (fileName, key, bucket, s3) {
    return new Promise(function (resolve, reject) {
        var params = {
            Bucket: bucket, Key: key, Body: fs.createReadStream(fileName)
        };
        s3.upload(params).send(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    uploadFile: uploadFile
};
