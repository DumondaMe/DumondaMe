const sharp = require('sharp');
const db = require('dumonda-me-server-lib').neo4j;
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const copyTitleImage = async function (users) {
    for (let userId of users) {
        try {
            const privateBucket = process.env.BUCKET_PRIVATE;
            await Promise.all([cdn.copyFile('profileImage/default/profile.jpg', `profileImage/${userId}/profile.jpg`, privateBucket),
                cdn.copyFile('profileImage/default/profilePreview.jpg', `profileImage/${userId}/profilePreview.jpg`,
                    privateBucket),
                cdn.copyFile('profileImage/default/thumbnail.jpg', `profileImage/${userId}/thumbnail.jpg`, privateBucket)]);
            console.log(`Uploaded images for user ${userId}`)
        } catch (error) {
            logger.error(`Error resize title image for user ${userId}`);
        }
    }
};

const processUserImage = async function () {
    await copyTitleImage(['5741fea8126db000']);
};

module.exports = {
    process: processUserImage
};
