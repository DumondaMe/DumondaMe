const sharp = require('sharp');
const db = require('dumonda-me-server-lib').neo4j;
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const addTitleImage = async function (pages) {
    for (let result of pages) {
        try {
            let titleImage = await cdn.getObject(`pages/${result.commitmentId}/normal.jpg`, process.env.BUCKET_PUBLIC);
            let newTitleImage600x600 = await sharp(titleImage.Body).resize(600, 600).max().jpeg({quality: 80})
                .toBuffer();
            let newTitleImage460x460 = await sharp(titleImage.Body).resize(460, 460).max().jpeg({quality: 80})
                .toBuffer();
            let newTitleImage320x320 = await sharp(titleImage.Body).resize(320, 320).max().jpeg({quality: 80})
                .toBuffer();
            let newTitleImage120x120 = await sharp(titleImage.Body).resize(120, 120).max().jpeg({quality: 80})
                .toBuffer();
            let newTitleImage40x40 = await sharp(titleImage.Body).resize(40, 40).crop(sharp.strategy.entropy).jpeg({quality: 80})
                .toBuffer();
            await cdn.uploadBuffer(newTitleImage600x600, `commitment/${result.commitmentId}/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage460x460, `commitment/${result.commitmentId}/460x460/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage320x320, `commitment/${result.commitmentId}/320x320/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage120x120, `commitment/${result.commitmentId}/120x120/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage40x40, `commitment/${result.commitmentId}/40x40/title.jpg`, process.env.BUCKET_PUBLIC);
            console.log(`Uploaded images for commitment ${result.commitmentId}`)
        } catch(error) {
            logger.error(`Error resize title image for commitment ${result.commitmentId}`);
        }
    }
};

const processAddImageCommitment = async function () {
    let pages = await db.cypher().match(`(commitment:Commitment)`)
        .return(`commitment.commitmentId AS commitmentId`)
        .end().send();
    await addTitleImage(pages);
};

module.exports = {
    processAddImageCommitment
};
