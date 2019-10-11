'use strict';

const db = requireDb();

const notAllowedToPerformAction = async function (userId, logger) {

    let resp = await db.cypher().match(`(u:HarvestingUser {userId: {userId}})`)
        .return(`u`)
        .end({userId}).send();

    if (resp.length > 0) {
        logger.error(`Harvesting user is not allowed to perform this action ${userId}`);
        throw new Error('401');
    }
};

module.exports = {
    notAllowedToPerformAction
};
