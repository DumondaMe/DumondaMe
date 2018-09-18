'use strict';

const db = requireDb();
let cdn = require('dumonda-me-server-lib').cdn;

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
            linkedWithQuestion: commitment.linkedWithQuestion,
            imageUrl: cdn.getPublicUrl(`commitment/${commitment.commitmentId}/120x120/title.jpg`)
        });
    }
    return response;
};

const getFilter = function (lang) {
    let filter = '';
    if (lang) {
        filter = 'c.language = {lang}';
    }
    return filter;
};

const getHasLinkToQuestion = function (questionId) {
    let returnEntity = '';
    if (questionId) {
        returnEntity = `, EXISTS((:Question {questionId: {questionId}})-[:ANSWER]->(:CommitmentAnswer)
                        -[:COMMITMENT]->(c)) AS linkedWithQuestion`;
    }
    return returnEntity;
};

const search = async function (query, lang, questionId) {
    let queryString = getQueryString(query);

    let result = await db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS c`)
        .where(getFilter(lang))
        .return(`c.title AS title, c.description AS description, c.commitmentId AS commitmentId 
                ${getHasLinkToQuestion(questionId)}`)
        .limit(`10`).end({queryString, lang, questionId}).send();
    return getResponse(result);
};

module.exports = {
    search
};
