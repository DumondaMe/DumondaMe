'use strict';

var gm = require('./../../util/gm');
var cdn = require('./../../util/cdn');
var tmp = require('tmp');

var uploadImage = function (originalFilePath, directory, id, width, maxPreviewHeight) {
    var preview = tmp.fileSync({postfix: '.jpg'}),
        normal = tmp.fileSync({postfix: '.jpg'}),
        thumbnail = tmp.fileSync({postfix: '.jpg'}),
        sizeOriginal, previewHeight,
        sigma = 0.5, amount = 0.7, threshold = 0;
    return gm.gm(originalFilePath).sizeAsync()
        .then(function (size) {
            sizeOriginal = size;
            previewHeight = width * (sizeOriginal.height / sizeOriginal.width );
            if (previewHeight > maxPreviewHeight) {
                previewHeight = maxPreviewHeight;
                return gm.gm(originalFilePath).resize(null, maxPreviewHeight).quality(80)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(preview.name);
            }
            return gm.gm(originalFilePath).resize(width).quality(80)
                .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(preview.name);
        })
        .then(function () {
            if (previewHeight === maxPreviewHeight) {
                return gm.gm(originalFilePath).resize(null, maxPreviewHeight).quality(86)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(normal.name);
            } else if(sizeOriginal.width > 600) {
                return gm.gm(originalFilePath).resize(600).quality(86)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(normal.name);
            } else if(sizeOriginal.width > 380) {
                return gm.gm(originalFilePath).resize(sizeOriginal.width).quality(86)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(normal.name);
            }
            return gm.gm(originalFilePath).resize(380).quality(86).unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(normal.name);
        })
        .then(function () {
            return gm.gm(originalFilePath).resize(64).quality(86).unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(thumbnail.name);
        })
        .then(function () {
            return cdn.uploadFile(preview.name, `${directory}/${id}/preview.jpg`);
        })
        .then(function () {
            return cdn.uploadFile(thumbnail.name, `${directory}/${id}/thumbnail.jpg`);
        })
        .then(function () {
            return cdn.uploadFile(normal.name, `${directory}/${id}/normal.jpg`);
        })
        .then(function () {
            preview.removeCallback();
            thumbnail.removeCallback();
            normal.removeCallback();
            return previewHeight;
        });
};

module.exports = {
    uploadImage: uploadImage
};
