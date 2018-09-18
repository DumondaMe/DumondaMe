const sharp = require('sharp');
const db = require('dumonda-me-server-lib').neo4j;
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const copyPagesToCommitment = async function (pages) {
    for (let result of pages) {
        try {
            await cdn.copyFile(`pages/${result.commitmentId}/normal.jpg`, `commitment/${result.commitmentId}/title.jpg`,
                process.env.BUCKET_PUBLIC)
        } catch(error) {
            logger.error(`Error copy page ${result.commitmentId}`);
        }
    }
};

const resizeTitleImage = async function (pages) {
    for (let result of pages) {
        try {
            let titleImage = await cdn.getObject(`commitment/${result.commitmentId}/title.jpg`, process.env.BUCKET_PUBLIC);
            let newTitleImage = await sharp(titleImage.Body).resize(300, 300)
                .crop(sharp.strategy.entropy).jpeg({quality: 93})
                .toBuffer();
            let newTitleImage120x120 = await sharp(newTitleImage).resize(120, 120).jpeg({quality: 93})
                .toBuffer();
            let newTitleImage148x148 = await sharp(newTitleImage).resize(148, 148).jpeg({quality: 93})
                .toBuffer();
            let newTitleImage460x460 = await sharp(newTitleImage).resize(460, 460).jpeg({quality: 93})
                .toBuffer();
            await cdn.uploadBuffer(newTitleImage, `commitment/${result.commitmentId}/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage120x120, `commitment/${result.commitmentId}/120x120/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage148x148, `commitment/${result.commitmentId}/148x148/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage460x460, `commitment/${result.commitmentId}/460x460/title.jpg`, process.env.BUCKET_PUBLIC);
        } catch(error) {
            logger.error(`Error resize title image for commitment ${result.commitmentId}`);
        }
    }
};

const processCommitment = async function () {
    let pages = await db.cypher().match(`(commitment:Commitment)`)
        .return(`commitment.commitmentId AS commitmentId`)
        .end().send();
    await copyPagesToCommitment(pages);
    await resizeTitleImage(pages);
};

module.exports = {
    processCommitment
};
