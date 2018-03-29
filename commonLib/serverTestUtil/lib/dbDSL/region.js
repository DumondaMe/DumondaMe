'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');

const createRegion = function (code, data) {
    data.upperRegionLayerCode = data.upperRegionLayerCode || null;
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(region:Region {code: {code}, name: {name}})`)
        .with(`region`)
        .match(`(upperRegionLayer:Region {code: {upperRegionLayerCode}})`)
        .merge(`(region)<-[:SUB_REGION]-(upperRegionLayer)`)
        .end({
            code, name: data.name, upperRegionLayerCode: data.upperRegionLayerCode
        }).getCommand());
};

module.exports = {
    createRegion
};