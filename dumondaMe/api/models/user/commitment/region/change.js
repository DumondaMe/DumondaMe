'use strict';

const db = requireDb();
const security = require('./../security');
const securityRegion = require('./../../../region/security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const changeRegions = async function (userId, commitmentId, regions) {
    await security.isAdmin(userId, commitmentId);
    securityRegion.checkOnlyInternational(regions);
    await securityRegion.checkRegionsExists(regions);
    await db.cypher().match(`(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .optionalMatch(`(c)-[rel:BELONGS_TO_REGION]->(:Region)`)
        .delete(`rel`)
        .with(`c`)
        .match(`(r:Region)`)
        .where(`r.regionId IN {regions}`)
        .merge(`(c)-[:BELONGS_TO_REGION]->(r)`)
        .end({userId, commitmentId, regions}).send();
    logger.info(`Regions changed for commitment ${commitmentId}`);
};

module.exports = {
    changeRegions
};
