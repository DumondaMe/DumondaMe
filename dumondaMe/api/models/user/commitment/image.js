'use strict';

const image = require('dumonda-me-server-lib').image;
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const uploadTitleImage = async function (titlePath, commitmentId, resetImage) {
    if (typeof titlePath === 'string') {
        await image.uploadImage(600, null, {
            quality: 93, originalImagePath: titlePath, cdnPath: `commitment/${commitmentId}/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC
        });
        await image.uploadImage(460, 344, {
            quality: 80, originalImagePath: titlePath, cdnPath: `commitment/${commitmentId}/460x460/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC
        });
        await image.uploadImage(320, 239, {
            quality: 80, originalImagePath: titlePath, cdnPath: `commitment/${commitmentId}/320x320/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC
        });
        await image.uploadImage(120, 90, {
            quality: 80, originalImagePath: titlePath, cdnPath: `commitment/${commitmentId}/120x120/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC
        });
        await image.uploadImage(40, 40, {
            quality: 80, originalImagePath: titlePath, cdnPath: `commitment/${commitmentId}/40x40/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC
        });
        logger.info(`Uploaded title image for commitment ${commitmentId}`);
    } else if (resetImage) {
        await cdn.copyFile(`default/commitment/title.jpg`, `commitment/${commitmentId}/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/460x460/title.jpg`, `commitment/${commitmentId}/460x460/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/320x320/title.jpg`, `commitment/${commitmentId}/320x320/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/120x120/title.jpg`, `commitment/${commitmentId}/120x120/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/40x40/title.jpg`, `commitment/${commitmentId}/40x40/title.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

module.exports = {
    uploadTitleImage
};
