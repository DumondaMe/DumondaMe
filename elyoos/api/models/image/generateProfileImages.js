/**
 * Generate the profile images for a user
 */
'use strict';

let sharp = require('sharp');
let cdn = require('elyoos-server-lib').cdn;

module.exports = {
    generateProfileImage: async function (originalFilePath, userId) {
        let previewBuffer = await sharp(originalFilePath).background({r: 255, g: 255, b: 255, alpha: 0}).flatten()
            .resize(100).max().jpeg({quality: 93}).withoutEnlargement().toBuffer();
        let thumbnailBuffer = await sharp(originalFilePath).background({r: 255, g: 255, b: 255, alpha: 0}).flatten()
            .resize(48).max().jpeg({quality: 90}).withoutEnlargement().toBuffer();
        let profileBuffer = await sharp(originalFilePath).background({r: 255, g: 255, b: 255, alpha: 0}).flatten()
            .resize(400).max().jpeg({quality: 92}).withoutEnlargement().toBuffer();

        await cdn.uploadBuffer(previewBuffer, 'profileImage/' + userId + '/profilePreview.jpg', process.env.BUCKET_PRIVATE);
        await cdn.uploadBuffer(thumbnailBuffer, 'profileImage/' + userId + '/thumbnail.jpg', process.env.BUCKET_PRIVATE);
        await cdn.uploadBuffer(profileBuffer, 'profileImage/' + userId + '/profile.jpg', process.env.BUCKET_PRIVATE);
    }
};
