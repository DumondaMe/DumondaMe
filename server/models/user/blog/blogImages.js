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
            previewHeight = 380 * (sizeOriginal.height / sizeOriginal.width );
            if (previewHeight > 1000) {
                previewHeight = 1000;
                return gm.gm(originalFilePath).resize(null, 1000).quality(82)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(preview.name);
            }
            return gm.gm(originalFilePath).resize(380).quality(82)
                .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(preview.name);
        })
        .then(function () {
            if (previewHeight === 1000) {
                return gm.gm(originalFilePath).resize(null, 1000).quality(94)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(normal.name);
            }
            return gm.gm(originalFilePath).resize(380).quality(94).unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(normal.name);
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
