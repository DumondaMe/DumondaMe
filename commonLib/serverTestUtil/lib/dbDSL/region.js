'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');

const createRegion = function (regionId, data) {
    data.parentRegionId = data.parentRegionId || null;
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(region:Region {regionId: {regionId}, de: {de}, en: {en}})`)
        .with(`region`)
        .match(`(parentRegion:Region {regionId: {parentRegionId}})`)
        .merge(`(region)<-[:SUB_REGION]-(parentRegion)`)
        .end({
            regionId, parentRegionId: data.parentRegionId, de: data.de, en: data.en
        }).getCommand());
};

module.exports = {
    createRegion
};