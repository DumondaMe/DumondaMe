/**
 * Generate the profile images for a user
 */
'use strict';

let gm = require('./../util/gm');
let cdn = require('elyoos-server-lib').cdn;
let tmp = require('tmp');

module.exports = {
    generateProfileImage: async function (originalFilePath, userId) {
        let preview = tmp.fileSync({postfix: '.jpg'}),
            thumbnail = tmp.fileSync({postfix: '.jpg'}),
            profile = tmp.fileSync({postfix: '.jpg'});

        await gm.gm(originalFilePath).background('#FFFFFF').flatten().thumbAsync(100, 100, preview.name, 93);
        await gm.gm(originalFilePath).background('#FFFFFF').flatten().thumbAsync(48, 48, thumbnail.name, 97);
        await gm.gm(originalFilePath).background('#FFFFFF').flatten().thumbAsync(450, 450, profile.name, 92);

        await cdn.uploadFile(preview.name, 'profileImage/' + userId + '/profilePreview.jpg', process.env.BUCKET_PRIVATE);
        await cdn.uploadFile(thumbnail.name, 'profileImage/' + userId + '/thumbnail.jpg', process.env.BUCKET_PRIVATE);
        await cdn.uploadFile(profile.name, 'profileImage/' + userId + '/profile.jpg', process.env.BUCKET_PRIVATE);

        preview.removeCallback();
        thumbnail.removeCallback();
        profile.removeCallback();
    }
};
