'use strict';

const db = requireDb();

const getOrder = function (language) {
    if (language === 'de') {
        return 'region.de';
    }
    return 'region.en';
};

const getResponse = function (regions) {
    let response = [];
    for (let region of regions) {
        response.push({
            regionId: region.region.regionId,
            regionParentId: 'international',
            de: region.region.de,
            en: region.region.en,
            numberOfSubRegions: region.numberOfSubRegions
        });
    }
    return response;
};

const getRegionsCommand = function (language, parentRegionId) {
    return db.cypher().match(`(region:Region)<-[:SUB_REGION]-(:Region {regionId: {parentRegionId}})`)
        .optionalMatch(`(region)-[:SUB_REGION]->(subRegion:Region)`)
        .return("region, count(subRegion) AS numberOfSubRegions")
        .orderBy(getOrder(language))
        .end({parentRegionId});
};

const getRegions = async function (language, parentRegionId) {
    let resp = await getRegionsCommand(language, parentRegionId).send();
    return {regions: getResponse(resp)};
};


module.exports = {
    getRegionsCommand,
    getRegions
};
