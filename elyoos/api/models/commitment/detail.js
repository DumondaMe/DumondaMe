'use strict';

const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getDetail = async function (userId, commitmentId) {

    let resp = await db.cypher().match("(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(user:User)")
        .optionalMatch(`(t:Topic)-[:TOPIC]->(c)`)
        .optionalMatch(`(r:Region)<-[:BELONGS_TO_REGION]-(c)`)
        .return(`c.title AS title, c.description AS description, c.website AS website, c.created AS created,
                 c.modified AS modified, c.language AS lang, 
                 EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(c)) AS isAdmin,
                 collect(DISTINCT t.name) AS topics, collect(DISTINCT r.code) AS regions`)
        .end({userId, commitmentId}).send();
    if (resp.length !== 1) {
        logger.warn(`Commitment ${commitmentId} had ${resp.length} results`);
        throw new Error('404');
    }
    resp[0].imageUrl = cdn.getPublicUrl(`commitment/${commitmentId}/148x148/title.jpg`, resp[0].modified);
    logger.info(`Get commitment ${commitmentId}`);
    return resp[0];
};

module.exports = {
    getDetail
};
