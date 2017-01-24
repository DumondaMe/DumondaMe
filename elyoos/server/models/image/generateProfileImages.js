/**
 * Generate the profile images for a user
 */
'use strict';

let gm = require('./../util/gm');
let cdn = require('elyoos-server-lib').cdn;
let tmp = require('tmp');

module.exports = {
    generateProfileImage: function (originalFilePath, userId) {
        let preview = tmp.fileSync({postfix: '.jpg'}),
            thumbnail = tmp.fileSync({postfix: '.jpg'}),
            profile = tmp.fileSync({postfix: '.jpg'});
        return gm.gm(originalFilePath).thumbAsync(100, 100, preview.name, 93)
            .then(function () {
                return gm.gm(originalFilePath).thumbAsync(48, 48, thumbnail.name, 97);
            })
            .then(function () {
                return gm.gm(originalFilePath).thumbAsync(350, 350, profile.name, 92);
            })
            .then(function () {
                return cdn.uploadFile(preview.name, 'profileImage/' + userId + '/profilePreview.jpg');
            })
            .then(function () {
                return cdn.uploadFile(thumbnail.name, 'profileImage/' + userId + '/thumbnail.jpg');
            })
            .then(function () {
                return cdn.uploadFile(profile.name, 'profileImage/' + userId + '/profile.jpg');
            })
            .then(function () {
                preview.removeCallback();
                thumbnail.removeCallback();
                profile.removeCallback();
            });
    }
};
