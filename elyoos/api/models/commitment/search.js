'use strict';

const db = requireDb();
let cdn = require('elyoos-server-lib').cdn;

const getQueryString = function (query) {
    let queryString = '';
    for (let word of query.trim().split(' ')) {
        if (word.trim().length > 0) {
            queryString += `Commitment.title:${word}*~ `;
        }
    }
    return queryString.trim();
};

const getResponse = function (commitments) {
    let response = [];
    for (let commitment of commitments) {
        response.push({
            commitmentId: commitment.commitmentId,
            title: commitment.title,
            description: commitment.description,
            imageUrl: cdn.getPublicUrl(`commitment/${commitment.commitmentId}/120x120/title.jpg`)
        });
    }
    return response;
};

const search = async function (query, lang) {
    let queryString = getQueryString(query);

    let result = await db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS c`)
        .where(`c.language = {lang}`)
        .return(`c.title AS title, c.description AS description, c.commitmentId AS commitmentId`)
        .limit(`10`).end({queryString, lang}).send();
    return getResponse(result);
};

module.exports = {
    search
};
