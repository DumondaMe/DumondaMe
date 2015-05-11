/**
 * Generate the profile images for a user
 */
'use strict';

var logger = requireLogger.getLogger(__filename);
var gm = require('./../util/gm');
var cdn = require('./../util/cdn');
var tmp = require('tmp');

module.exports = {
    generatePageImage: function (originalFilePath, label, pageId) {
        var preview = tmp.fileSync({postfix: '.jpg'}),
            normal = tmp.fileSync({postfix: '.jpg'}),
            original = tmp.fileSync({postfix: '.jpg'});
        return gm.gm(originalFilePath).resize(null, 100).writeAsync(preview.name)
            .then(function () {
                return gm.gm(originalFilePath).resize(null, 200).writeAsync(normal.name);
            })
            .then(function () {
                return gm.gm(originalFilePath).sizeAsync();
            })
            .then(function (size) {
                if (size.height > 1000) {
                    return gm.gm(originalFilePath).resize(null, 1000).writeAsync(original.name);
                }
                return gm.gm(originalFilePath).resize(null, size.height).writeAsync(original.name);
            })
            .then(function () {
                return cdn.uploadFile(preview.name, 'pages/' + label + '/' + pageId + '/pagePreview.jpg');
            })
            .then(function () {
                return cdn.uploadFile(normal.name, 'pages/' + label + '/' + pageId + '/pageTitlePicture.jpg');
            })
            .then(function () {
                return cdn.uploadFile(original.name, 'pages/' + label + '/' + pageId + '/original.jpg');
            })
            .then(function () {
                preview.removeCallback();
                normal.removeCallback();
                original.removeCallback();
            });
    }
};
