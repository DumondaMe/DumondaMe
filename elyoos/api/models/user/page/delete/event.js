'use strict';

let db = requireDb();
let security = require('./../securityEvent');

let deleteEvent= function (userId, params, req) {

    return security.checkAllowedToDeletePageEvent(userId, params.eventId, req).then(function () {
        return db.cypher().match("(:User {userId: {userId}})-[isAdmin:IS_ADMIN]->(page:Page)-[eventRel:EVENT]->(event:Event {eventId: {eventId}})")
            .optionalMatch("(event)-[:HAS]->(addressToDelete:Address)")
            .with("event, eventRel, addressToDelete")
            .optionalMatch("(addressToDelete)<-[:HAS]-(refEvents:Event)")
            .with("event, eventRel, COUNT(refEvents) AS numberOfEvents")
            .optionalMatch("(event)-[:HAS]->(addressToDelete:Address)")
            .where("NOT (addressToDelete)<-[:HAS]-(:Page) AND NOT numberOfEvents > 1")
            .optionalMatch("(event)-[relAddress:HAS]->(:Address)")
            .delete("event, eventRel, addressToDelete, relAddress")
            .end({userId: userId, eventId: params.eventId}).send();
    });
};

module.exports = {
    deleteEvent: deleteEvent
};
