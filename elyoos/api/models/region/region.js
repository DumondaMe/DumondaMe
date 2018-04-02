'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const parseRegionsQueryResult = function (allRegions, parsedRegions) {
    let subRegions = allRegions.find((r) => r.upperRegion === parsedRegions.code);
    if (subRegions && subRegions.regions && subRegions.regions.length > 0) {
        for (let region of subRegions.regions) {
            let parsedSubRegion = {code: region, subRegions: []};
            parseRegionsQueryResult(allRegions, parsedSubRegion);
            parsedRegions.subRegions.push(parsedSubRegion)
        }
    }
    return parsedRegions;
};

const getRegions = async function () {

    let resp = await db.cypher().match(`(r:Region)`)
        .optionalMatch(`(r)<-[:SUB_REGION]-(upperRegion:Region)`)
        .with(`r, upperRegion`)
        .orderBy(`r.code`)
        .return(`collect(r.code) AS regions, upperRegion.code AS upperRegion`)
        .end().send();

    let regions = parseRegionsQueryResult(resp, {code: 'international', subRegions: []});
    logger.info(`Get all regions`);
    return {regions: [{code: 'international', subRegions: []}].concat(regions.subRegions)};
};

module.exports = {
    getRegions
};
