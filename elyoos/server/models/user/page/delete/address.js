'use strict';

let db = requireDb();
let security = require('./../securityAddress');

let hasEvents = function (userId, addressId) {
    return db.cypher().match(`(:User {userId: {userId}})-[:IS_ADMIN]->(page:Page)
                              -[relAddress:HAS]->(addressToDelete:Address {addressId: {addressId}})`)
        .optionalMatch("(event:Event)-[:HAS]->(addressToDelete:Address)")
        .return("event")
        .end({userId: userId, addressId: addressId}).send();
};

let getDeleteElement = function (result) {
    if (result.length === 1 && result[0].hasOwnProperty('event')) {
        return "relAddress";
    }
    return "addressToDelete, relAddress";
};

let deleteAddress = function (userId, params, req) {

    return security.checkAllowedToEditAddress(params, userId, req).then(function () {
        return hasEvents(userId, params.addressId);
    }).then(function (result) {
        return db.cypher().match(`(:User {userId: {userId}})-[:IS_ADMIN]->(page:Page)
                                  -[relAddress:HAS]->(addressToDelete:Address {addressId: {addressId}})`)
            .delete(getDeleteElement(result))
            .end({userId: userId, addressId: params.addressId}).send();

    });
};

module.exports = {
    deleteAddress: deleteAddress
};
