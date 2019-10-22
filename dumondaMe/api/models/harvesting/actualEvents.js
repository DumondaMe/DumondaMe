"use strict";

const db = requireDb();
const slug = require('limax');
const time = require('dumonda-me-server-lib').time;
const cdn = require('dumonda-me-server-lib').cdn;

const getResponse = async function (events) {
    let response = [];
    for (let event of events) {
        response.push({
            userId: event.userId,
            name: event.name,
            slug: slug(event.name),
            startDate: event.startDate,
            endDate: event.endDate,
            image: await cdn.getSignedUrl(`profileImage/${event.userId}/profile.jpg`)
        });
    }
    return {events: response};
};

const getEvents = async function () {

    let events = await db.cypher().match(`(user:User:HarvestingUser)`)
        .return(`user.userId AS userId, user.name AS name, user.start AS startDate, user.end AS endDate,
        ({now} - user.end) AS orderIndex`)
        .orderBy(`orderIndex DESC`).end({now: time.getNowUtcTimestamp()}).send();

    return await getResponse(events);
};

module.exports = {
    getEvents
};
