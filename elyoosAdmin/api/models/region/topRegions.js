'use strict';

const db = requireDb();

const getOrder = function (language) {
    if (language === 'de') {
        return 'region.de';
    }
    return 'region.en';
};

const getTopRegions = function (language) {
    return db.cypher().match(`(region:Region)<-[:SUB_REGION]-(:Region {regionId: 'international'})`)
        .optionalMatch(`(region)-[:SUB_REGION]->(subRegion:Region)`)
        .return("region, count(subRegion) AS numberOfSubRegions")
        .orderBy(getOrder(language))
        .end();
};


module.exports = {
    getTopRegions
};
