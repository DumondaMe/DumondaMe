'use strict';

const db = requireDb();
const security = require('./security');
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const deleteCommitment = async function (userId, commitmentId) {
    await security.isAdmin(userId, commitmentId);
    await db.cypher().match(`(commitment:Commitment {commitmentId: {commitmentId}})`)
        .optionalMatch(`(commitment)-[rel]-()`)
        .optionalMatch(`(commitment)-[:EVENT]-(event:Event)-[relEvent]-()`)
        .delete(`commitment, rel, event, relEvent`)
        .end({commitmentId}).send();

    await cdn.deleteFolder(`commitment/${commitmentId}/`, process.env.BUCKET_PUBLIC);

    logger.info(`Admin ${userId} deleted commitment ${commitmentId}`);
};

module.exports = {
    deleteCommitment
};
