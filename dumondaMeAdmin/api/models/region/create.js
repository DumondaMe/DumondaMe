'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const checkParentRegionExists = async function (parentRegionId, req) {
    let resp = await db.cypher().match(`(parentRegion:Region {regionId: {parentRegionId}})`)
        .return(`parentRegion`).end({parentRegionId}).send();
    if (resp.length === 0) {
        return exceptions.getInvalidOperation(`region ${parentRegionId} does not exist`, logger, req);
    }
};

const create = async function (params, req) {
    params.regionId = uuid.generateUUID();
    await checkParentRegionExists(params.parentRegionId, req);
    await db.cypher().match(`(parentRegion:Region {regionId: {parentRegionId}})`)
        .create(`(region:Region {regionId: {regionId}, de: {de}, en: {en}})`)
        .merge(`(parentRegion)-[:SUB_REGION]->(region)`)
        .end(params).send();

    return {regionId: params.regionId};
};


module.exports = {
    create,
};
