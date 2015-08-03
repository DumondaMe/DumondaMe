'use strict';

var gm = require('./../../util/gm');
var cdn = require('./../../util/cdn');
var tmp = require('tmp');

var uploadImages = function (originalFilePath, blogId) {
    var preview = tmp.fileSync({postfix: '.jpg'}),
        normal = tmp.fileSync({postfix: '.jpg'}),
        sizeOriginal, previewHeight,
        sigma = 0.5, amount = 0.7, threshold = 0;
    return gm.gm(originalFilePath).sizeAsync()
        .then(function (size) {
            sizeOriginal = size;
            if(sizeOriginal.width > sizeOriginal.height) {
                previewHeight = 300 * (sizeOriginal.height / sizeOriginal.width );
                return gm.gm(originalFilePath).resize(300).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(preview.name);
            } else if (sizeOriginal.height > 600) {
                previewHeight = 600;
                return gm.gm(originalFilePath).resize(null, 600).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(preview.name);
            }
            previewHeight = sizeOriginal.height;
            return gm.gm(originalFilePath).resize(null, sizeOriginal.height).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(preview.name);
        })
        .then(function () {
            if(sizeOriginal.width > sizeOriginal.height) {
                return gm.gm(originalFilePath).resize(300).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(normal.name);
            } else if (sizeOriginal.height > 600) {
                return gm.gm(originalFilePath).resize(null, 600).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(normal.name);
            }
            return gm.gm(originalFilePath).resize(null, 600).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(normal.name);
        })
        .then(function () {
            return cdn.uploadFile(preview.name, 'blog/' + blogId + '/preview.jpg');
        })
        .then(function () {
            return cdn.uploadFile(normal.name, 'blog/' + blogId + '/normal.jpg');
        })
        .then(function () {
            preview.removeCallback();
            normal.removeCallback();
            return previewHeight;
        });
};

module.exports = {
    uploadImages: uploadImages
};
