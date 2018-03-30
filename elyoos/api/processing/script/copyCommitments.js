const sharp = require('sharp');
const db = require('elyoos-server-lib').neo4j;
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const copyPagesToCommitment = async function (pages) {
    for (let result of pages) {
        try {
            await cdn.copyFile(`pages/${result.answerId}/normal.jpg`, `commitment/${result.answerId}/title.jpg`,
                process.env.BUCKET_PUBLIC)
        } catch(error) {
            logger.error(`Error copy page ${result.answerId}`);
        }
    }
};

const resizeTitleImage = async function (pages) {
    for (let result of pages) {
        try {
            let titleImage = await cdn.getObject(`commitment/${result.answerId}/title.jpg`, process.env.BUCKET_PUBLIC);
            let newTitleImage = await sharp(titleImage.Body).resize(300, 300)
                .crop(sharp.strategy.entropy).jpeg({quality: 93})
                .toBuffer();
            let newTitleImage120x120 = await sharp(newTitleImage).resize(120, 120).jpeg({quality: 93})
                .toBuffer();
            let newTitleImage148x148 = await sharp(newTitleImage).resize(148, 148).jpeg({quality: 93})
                .toBuffer();
            await cdn.uploadBuffer(newTitleImage, `commitment/${result.answerId}/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage120x120, `commitment/${result.answerId}/120x120/title.jpg`, process.env.BUCKET_PUBLIC);
            await cdn.uploadBuffer(newTitleImage148x148, `commitment/${result.answerId}/148x148/title.jpg`, process.env.BUCKET_PUBLIC);
        } catch(error) {
            logger.error(`Error resize title image for commitment ${result.answerId}`);
        }
    }
};

const processCommitment = async function () {
    let pages = await db.cypher().match(`(commitment:Commitment)`)
        .return(`commitment.answerId AS answerId`)
        .end().send();
    await copyPagesToCommitment(pages);
    await resizeTitleImage(pages);
};

module.exports = {
    processCommitment
};
