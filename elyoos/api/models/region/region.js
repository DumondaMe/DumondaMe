'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const parseRegionsQueryResult = function (allRegions, parsedRegions, language) {
    let subRegions = allRegions.find((r) => r.upperRegion === parsedRegions.id);
    if (subRegions && subRegions.regions && subRegions.regions.length > 0) {
        for (let region of subRegions.regions) {
            let parsedSubRegion = {id: region.regionId, description: region[language], subItems: []};
            parseRegionsQueryResult(allRegions, parsedSubRegion, language);
            parsedRegions.subItems.push(parsedSubRegion)
        }
    }
    return parsedRegions;
};

const getInternational = function (regions, language) {
    return {id: 'international', description: regions[0].regions[0][language], subItems: []};
};

const getRegions = async function (language) {

    let resp = await db.cypher().match(`(r:Region)`)
        .optionalMatch(`(r)<-[:SUB_REGION]-(upperRegion:Region)`)
        .with(`r, upperRegion`)
        .orderBy(`r.${language}`)
        .return(`collect(r) AS regions, upperRegion.regionId AS upperRegion, 
                 exists(upperRegion.regionId) AS upperRegionExists`)
        .orderBy(`upperRegionExists DESC`)
        .end().send();

    let regions = parseRegionsQueryResult(resp, {id: 'international', subItems: []}, language);
    logger.info(`Get all regions`);
    return {
        regions: [getInternational(resp, language)].concat(regions.subItems)
    };
};

module.exports = {
    getRegions
};
