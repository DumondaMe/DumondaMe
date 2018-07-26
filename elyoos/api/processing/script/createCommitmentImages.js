const sharp = require('sharp');
const db = require('elyoos-server-lib').neo4j;
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const addTitleImage = async function (pages) {
    for (let result of pages) {
        try {
            let titleImage = await cdn.getObject(`commitment/${result.commitmentId}/title.jpg`, process.env.BUCKET_PUBLIC);
            let newTitleImage460x460 = await sharp(titleImage.Body).resize(460, 460).jpeg({quality: 93})
                .toBuffer();
            await cdn.uploadBuffer(newTitleImage460x460, `commitment/${result.commitmentId}/460x460/title.jpg`, process.env.BUCKET_PUBLIC);
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
