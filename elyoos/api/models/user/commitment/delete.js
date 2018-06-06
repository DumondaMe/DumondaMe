'use strict';

const db = requireDb();
const security = require('./security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const deleteCommitment = async function (userId, commitmentId) {
    await security.isAdmin(userId, commitmentId);
    await db.cypher().match(`(commitment:Commitment {commitmentId: {commitmentId}})`)
        .optionalMatch(`(commitment)-[rel]-()`)
        .optionalMatch(`(commitment)-[:EVENT]-(event:Event)-[relEvent]-()`)
        .delete(`commitment, rel, event, relEvent`)
        .end({commitmentId}).send();

    logger.info(`Admin ${userId} deleted commitment ${commitmentId}`);
};

module.exports = {
    deleteCommitment
};
