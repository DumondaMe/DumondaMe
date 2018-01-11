'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getEventResponse = function (resp) {
    return {
        pageId: resp.page.pageId,
        pageTitle: resp.page.title,
        eventId: resp.event.eventId,
        title: resp.event.title,
        description: resp.event.description,
        linkDescription: resp.event.linkDescription,
        startDate: resp.event.startDate,
        endDate: resp.event.endDate,
        address: resp.address.address,
        addressDescription: resp.address.description
    };
};

let getDetail = function (userId, params, req) {
    return db.cypher().match("(page)-[:EVENT]->(event:Event {eventId: {eventId}})-[:HAS]->(address:Address)")
        .return("event, address, page")
        .end(params).send().then(function (resp) {
            if (resp.length === 1) {
                return getEventResponse(resp[0]);
            }
            return exceptions.getInvalidOperation(`Event does not exist ${params.eventId}`, logger, req);
        });
};

module.exports = {
    getDetail: getDetail
};
