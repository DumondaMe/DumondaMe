'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const checkRegionExists = async function (regionId, req) {
    let resp = await db.cypher().match(`(region:Region {regionId: {regionId}})`)
        .return(`region`).end({regionId}).send();
    if (resp.length === 0) {
        return exceptions.getInvalidOperation(`region ${regionId} does not exist`, logger, req);
    }
};

const edit = async function (params, req) {
    await checkRegionExists(params.parentRegionId, req);
    await checkRegionExists(params.regionId, req);

    await db.cypher()
        .match(`(region:Region {regionId: {regionId}})`)
        .optionalMatch(`(region)<-[subRel:SUB_REGION]-(:Region)`)
        .set(`region`, {de: params.de, en: params.en})
        .delete(`subRel`)
        .with(`region`)
        .match(`(parentRegion:Region {regionId: {parentRegionId}})`)
        .merge(`(parentRegion)-[:SUB_REGION]->(region)`)
        .end(params).send();
};


module.exports = {
    edit,
};
