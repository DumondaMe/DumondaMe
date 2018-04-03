'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const checkRegionsExists = async function (regions) {

    let resp = await db.cypher().match(`(r:Region)`)
        .where(`r.code IN {regions}`)
        .return(`COUNT(*) AS numberOfRegions`)
        .end({regions}).send();

    if (resp[0].numberOfRegions !== regions.length) {
        logger.error(`Non existing regions used ${regions}`);
        throw new Error('401');
    }
};

const checkOnlyInternational = function (regions) {
    let index = regions.indexOf('international');
    if (index > -1 && regions.length > 1) {
        logger.error(`Not allowed to add other regions with international ${regions}`);
        throw new Error('401');
    }
};

module.exports = {
    checkRegionsExists,
    checkOnlyInternational
};
