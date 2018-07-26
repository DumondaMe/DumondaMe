'use strict';

const sharp = require('sharp');
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const uploadTitleImage = async function (titlePath, answerId, resetImage) {
    if (typeof titlePath === 'string') {
        let original = await sharp(titlePath).background({r: 255, g: 255, b: 255, alpha: 0}).flatten().resize(600, 600)
            .crop(sharp.strategy.entropy).jpeg({quality: 93}).toBuffer();
        let title460x460 = await sharp(original)
            .resize(460, 460).jpeg({quality: 80}).toBuffer();
        let title148x148 = await sharp(original)
            .resize(148, 148).jpeg({quality: 80}).toBuffer();
        let title120x120 = await sharp(original)
            .resize(120, 120).jpeg({quality: 80}).toBuffer();
        await cdn.uploadBuffer(original, `commitment/${answerId}/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title460x460, `commitment/${answerId}/460x460/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title148x148, `commitment/${answerId}/148x148/title.jpg`, process.env.BUCKET_PUBLIC);
        await cdn.uploadBuffer(title120x120, `commitment/${answerId}/120x120/title.jpg`, process.env.BUCKET_PUBLIC);
        logger.info(`Uploaded title image for commitment ${answerId}`);
    } else if (resetImage) {
        await cdn.copyFile(`default/commitment/title.jpg`, `commitment/${answerId}/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/460x460/title.jpg`, `commitment/${answerId}/460x460/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/148x148/title.jpg`, `commitment/${answerId}/148x148/title.jpg`,
            process.env.BUCKET_PUBLIC);
        await cdn.copyFile(`default/commitment/120x120/title.jpg`, `commitment/${answerId}/120x120/title.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

module.exports = {
    uploadTitleImage
};
