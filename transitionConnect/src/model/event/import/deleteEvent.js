'use strict';

let db = requireDb();

let deleteEvent = async function (uid) {
    return await db.cypher().match(`(org:Page)-[eventRel:EVENT]->(event:Event:ImportTC {uid: {uid}})`)
        .where(`org:ImportTC OR EXISTS((org)<-[:EXPORT_TO_TC]-(:TransitionConnectExport))`)
        .optionalMatch(`(event)-[relAddress:HAS]->(address:Address)`)
        .delete(`event, eventRel, relAddress, address`)
        .end({uid: uid}).send();
};

module.exports = {
    delete: deleteEvent
};
