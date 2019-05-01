'use strict';

const db = requireDb();
const commitmentSecurity = require('./../security');
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const atLeastOneAdminAfterRemoving = async function (commitmentId) {
    let response = await db.cypher()
        .match(`(u:User)-[:IS_ADMIN]->(:Commitment {commitmentId: {commitmentId}})`)
        .return(`count(*) AS numberOfAdmins`)
        .end({commitmentId}).send();

    if (response[0].numberOfAdmins < 2) {
        throw new exceptions.InvalidOperation(`At least one admin for commitment ${commitmentId} is mandatory`);
    }
};

const adminToRemoveIsNotAdminOfCommitment = async function (commitmentId, adminIdToRemove) {
    let response = await db.cypher()
        .match(`(u:User {userId: {adminIdToRemove}})-[:IS_ADMIN]->(:Commitment {commitmentId: {commitmentId}})`)
        .return(`u`)
        .end({commitmentId, adminIdToRemove}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${adminIdToRemove} is not admin of commitment ${commitmentId}`);
    }
};

const remove = async function (userId, adminIdToRemove, commitmentId) {
    await commitmentSecurity.isAdmin(userId, commitmentId);
    await atLeastOneAdminAfterRemoving(commitmentId);
    await adminToRemoveIsNotAdminOfCommitment(commitmentId, adminIdToRemove);
    await db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .with(`c`)
        .match(`(:User {userId: {adminIdToRemove}})-[relAdmin:IS_ADMIN]->(c)`)
        .delete(`relAdmin`)
        .end({userId, adminIdToRemove, commitmentId}).send();

    logger.info(`Admin ${userId} removed admin ${adminIdToRemove} from commitment ${commitmentId}`);
};

module.exports = {
    remove
};
