'use strict';

let db = requireDb();

let deleteEvent = async function (uid) {
    return await db.cypher().match(`(:Page:ImportTC)-[eventRel:EVENT]->(event:Event:ImportTC {uid: {uid}})`)
        .optionalMatch(`(event)-[relAddress:HAS]->(address:Address)`)
        .delete(`event, eventRel, relAddress, address`)
        .end({uid: uid}).send();
};

module.exports = {
    delete: deleteEvent
};
