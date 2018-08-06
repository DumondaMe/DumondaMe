'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const parseRegionsQueryResult = function (allRegions, parsedRegions, language) {
    let subRegions = allRegions.find((r) => r.upperRegion === parsedRegions.regionId);
    if (subRegions && subRegions.regions && subRegions.regions.length > 0) {
        for (let region of subRegions.regions) {
            let parsedSubRegion = {regionId: region.regionId, description: region[language], subRegions: []};
            parseRegionsQueryResult(allRegions, parsedSubRegion, language);
            parsedRegions.subRegions.push(parsedSubRegion)
        }
    }
    return parsedRegions;
};

const getRegions = async function (language) {

    let resp = await db.cypher().match(`(r:Region)`)
        .optionalMatch(`(r)<-[:SUB_REGION]-(upperRegion:Region)`)
        .with(`r, upperRegion`)
        .orderBy(`r.${language}`)
        .return(`collect(r) AS regions, upperRegion.regionId AS upperRegion`)
        .end().send();

    let regions = parseRegionsQueryResult(resp, {regionId: 'international', subRegions: []}, language);
    logger.info(`Get all regions`);
    return {
        regions: [{regionId: 'international', description: 'InternationalDe', subRegions: []}]
            .concat(regions.subRegions)
    };
};

module.exports = {
    getRegions
};
