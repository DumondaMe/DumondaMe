/**
 * Generate the profile images for a user
 */
'use strict';

var gm = require('./../util/gm');
var cdn = require('./../util/cdn');
var tmp = require('tmp');

var uploadImages = function (originalFilePath, pageId) {
    var preview = tmp.fileSync({postfix: '.jpg'}),
        normal = tmp.fileSync({postfix: '.jpg'}),
        original = tmp.fileSync({postfix: '.jpg'}),
        sigma = 0.5, amount = 0.7, threshold = 0;
    return gm.gm(originalFilePath).resize(160).quality(90).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(preview.name)
        .then(function () {
            return gm.gm(originalFilePath).resize(300).quality(94).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(normal.name);
        })
        .then(function () {
            return gm.gm(originalFilePath).sizeAsync();
        })
        .then(function (size) {
            if (size.height > 600) {
                return gm.gm(originalFilePath).resize(600).quality(92).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(original.name);
            }
            return gm.gm(originalFilePath).resize(size.height).quality(92).unsharp(2 + sigma, sigma, amount, threshold).writeAsync(original.name);
        })
        .then(function () {
            return cdn.uploadFile(preview.name, 'pages/' + pageId + '/pagePreview.jpg');
        })
        .then(function () {
            return cdn.uploadFile(normal.name, 'pages/' + pageId + '/pageTitlePicture.jpg');
        })
        .then(function () {
            return cdn.uploadFile(original.name, 'pages/' + pageId + '/original.jpg');
        })
        .then(function () {
            preview.removeCallback();
            normal.removeCallback();
            original.removeCallback();
        });
};

var copyDefaultImages = function (pageId) {
    return cdn.copyFile('pages/default/pagePreview.jpg', 'pages/' + pageId + '/pagePreview.jpg')
        .then(function () {
            cdn.copyFile('pages/default/pageTitlePicture.jpg', 'pages/' + pageId + '/pageTitlePicture.jpg');
        });
};

module.exports = {
    generatePageImage: function (originalFilePath, pageId) {
        if (originalFilePath) {
            return uploadImages(originalFilePath, pageId);
        }

        return copyDefaultImages(pageId);
    }
};
