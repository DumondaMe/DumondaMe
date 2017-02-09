'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAllowedToAddAddress = function (params, userId, req) {

    return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'})<-[:IS_ADMIN]-(:User {userId: {userId}})")
        .return("page")
        .end({genericPageId: params.genericPageId, userId: userId}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`User ${userId} is not admin of generic page ${params.genericPageId}`, logger, req);
            }
        });
};

let checkAllowedToEditAddress = function (params, userId, req) {

    return db.cypher().match("(:Address {addressId: {addressId}})<-[:HAS]-(page:Page {label: 'Generic'})<-[:IS_ADMIN]-(:User {userId: {userId}})")
        .return("page")
        .end({addressId: params.addressId, userId: userId}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`User ${userId} is not admin of generic page for address ${params.addressId}`, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToAddAddress: checkAllowedToAddAddress,
    checkAllowedToEditAddress: checkAllowedToEditAddress
};
