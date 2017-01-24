'use strict';

let gm = require('./../../util/gm');
let cdn = require('elyoos-server-lib').cdn;
let tmp = require('tmp');

let uploadImage = function (originalFilePath, directory, id, widthPreview, maxPreviewHeight) {
    let preview = tmp.fileSync({postfix: '.jpg'}),
        normal = tmp.fileSync({postfix: '.jpg'}),
        thumbnail = tmp.fileSync({postfix: '.jpg'}),
        sizeOriginal, previewHeight,
        sigma = 0.5, amount = 0.7, threshold = 0;
    return gm.gm(originalFilePath).sizeAsync()
        .then(function (size) {
            sizeOriginal = size;
            previewHeight = widthPreview * (sizeOriginal.height / sizeOriginal.width );
            if (previewHeight > maxPreviewHeight) {
                previewHeight = maxPreviewHeight;
                return gm.gm(originalFilePath).resize(null, maxPreviewHeight).quality(80)
                    .unsharp(2 + sigma, sigma, amount, threshold).noProfile().writeAsync(preview.name);
            }
            return gm.gm(originalFilePath).resize(widthPreview).quality(80)
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

let copyDefaultImages = function (sourcePath, destinationPath) {
    return cdn.copyFile(`${sourcePath}/preview.jpg`, `${destinationPath}/preview.jpg`)
        .then(function () {
            cdn.copyFile(`${sourcePath}/thumbnail.jpg`, `${destinationPath}/thumbnail.jpg`);
        }).then(function () {
            cdn.copyFile(`${sourcePath}/normal.jpg`, `${destinationPath}/normal.jpg`);
        });
};

module.exports = {
    uploadImage: function (originalFilePath, directory, id, width, maxPreviewHeight, defaultPath) {
        if (typeof originalFilePath === 'string' && originalFilePath.trim() !== '') {
            return uploadImage(originalFilePath, directory, id, width, maxPreviewHeight);
        } else if(typeof defaultPath === 'string' && defaultPath.trim() !== '') {
            return copyDefaultImages(defaultPath, `${directory}/${id}`);
        }
    }
};
