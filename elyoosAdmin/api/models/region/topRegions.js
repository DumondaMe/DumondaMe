'use strict';

const db = requireDb();

const getTopRegions = function () {
    return db.cypher().match(`(region:Region)<-[:SUB_REGION]-(:Region {regionId: 'international'})`)
        .return("region.de AS region")
        .orderBy("region.de")
        .end();
};



module.exports = {
    getTopRegions
};
