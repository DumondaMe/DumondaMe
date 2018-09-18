'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const checkTopicsExists = async function (topics) {

    let resp = await db.cypher().match(`(r:Topic)`)
        .where(`r.topicId IN {topics}`)
        .return(`COUNT(*) AS numberOfTopics`)
        .end({topics}).send();

    if (resp[0].numberOfTopics !== topics.length) {
        logger.error(`Non existing topics used ${topics}`);
        throw new Error('401');
    }
};

module.exports = {
    checkTopicsExists
};
