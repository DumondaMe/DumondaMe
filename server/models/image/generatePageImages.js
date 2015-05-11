/**
 * Generate the profile images for a user
 */
'use strict';

var logger = requireLogger.getLogger(__filename);
var gm = require('./../util/gm');
var cdn = require('./../util/cdn');
var tmp = require('tmp');

module.exports = {
    generateProfileImage: function (originalFilePath, label, pageId) {
        var preview = tmp.fileSync({postfix: '.jpg'}),
            normal = tmp.fileSync({postfix: '.jpg'}),
            expanded = tmp.fileSync({postfix: '.jpg'});
        return gm.gm(originalFilePath).resize(null, 100).writeAsync(preview.name)
            .then(function () {
                return cdn.uploadFile(preview.name, 'pages/' + label + '/' + pageId + '/pagePreview.jpg');
            })
            .then(function () {
                preview.removeCallback();
                normal.removeCallback();
                expanded.removeCallback();
            });
    }
};
