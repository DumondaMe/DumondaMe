/**
 * Generate the profile images for a user
 */
'use strict';

var logger = requireLogger.getLogger(__filename);
var gm = require('gm');
var cdnPath = require('./../../lib/cdn').getConfig().path;
var mkdirp = require('mkdirp');

module.exports = {
    generateProfileImage: function (originalFilePath, userId) {
        var path = cdnPath + '/' + userId + '/profileImage/';
        mkdirp.sync(path);
        return gm(originalFilePath).thumbAsync(100, 100, path + 'profilePreview.jpg', 90)
            .then(function () {
                return gm(originalFilePath).thumbAsync(35, 35, path + 'thumbnail.jpg', 95);
            })
            .then(function () {
                return gm(originalFilePath).thumbAsync(350, 350, path + 'profile.jpg', 92);
            });
    }
};
