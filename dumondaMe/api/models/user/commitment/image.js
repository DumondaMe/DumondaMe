'use strict';

const sharp = require('sharp');
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const uploadTitleImage = async function (titlePath, answerId, resetImage) {
    if (typeof titlePath === 'string') {
        let original = await sharp(titlePath).background({r: 255, g: 255, b: 255, alpha: 0}).flatten().max()
            .resize(600, 600).jpeg({quality: 93}).toBuffer();
        let title460x460 = await sharp(original).max().resize(460, 344).jpeg({quality: 80}).toBuffer();
        let title320x320 = await sharp(original).max().resize(320, 239).jpeg({quality: 80}).toBuffer();
        let title120x120 = await sharp(original).max().resize(120, 90).jpeg({quality: 80}).toBuffer();
        let title40x40 = await sharp(original).crop(sharp.strategy.entropy)
            .resize(40, 40).jpeg({quality: 90}).toBuffer();
        await cdn.uploadBuffer(original, `commitment/${answerId}/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title460x460, `commitment/${answerId}/460x460/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title320x320, `commitment/${answerId}/320x320/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title120x120, `commitment/${answerId}/120x120/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title40x40, `commitment/${answerId}/40x40/title.jpg`, process.env.BUCKET_PUBLIC);
        logger.info(`Uploaded title image for commitment ${answerId}`);
    } else if (resetImage) {
        await cdn.copyFile(`default/commitment/title.jpg`, `commitment/${answerId}/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/460x460/title.jpg`, `commitment/${answerId}/460x460/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/320x320/title.jpg`, `commitment/${answerId}/320x320/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/120x120/title.jpg`, `commitment/${answerId}/120x120/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/40x40/title.jpg`, `commitment/${answerId}/40x40/title.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

module.exports = {
    uploadTitleImage
};
