'use strict';

const db = requireDb();
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');

const PAGE_SIZE = 20;

const getNotesResponse = function (notes, userId) {
    let responses = [];
    for (let note of notes) {
        let response = {
            noteId: note.noteId,
            text: note.text,
            textHtml: linkifyHtml(note.text),
            created: note.created,
            upVotes: note.upVotes,
            hasVoted: note.hasVoted,
            isAdmin: note.isAdmin
        };
        if (note.creator.privacyMode === 'public' || note.creator.userId === userId ||
            (note.creator.privacyMode === 'publicEl' && userId !== null) ||
            (note.creator.privacyMode === 'onlyContact' && note.creatorTrustUser)) {
            response.creator = {
                isAnonymous: false,
                userId: note.creator.userId,
                name: note.creator.name,
                slug: slug(note.creator.name)
            };
        } else {
            response.creator = {isAnonymous: true};
        }
        responses.push(response);
    }
    return responses;
};

const getTotalNumberOfNotesCommand = function (answerId) {
    return db.cypher().match(`(answer:Answer {answerId: {answerId}})`)
        .optionalMatch(`(answer)-[:NOTE]->(note:Note)`)
        .return(`count(*) AS numberOfNotes`).end({answerId}).getCommand();
};

const getSortOrder = function (sort) {
    if (sort === 'newest') {
        return `created DESC`;
    }
    return `upVotes DESC, created DESC`;
};

const getNotes = async function (userId, answerId, page, sort) {
    page = PAGE_SIZE * page;
    let response = await db.cypher().match(`(answer:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(answer)-[:NOTE]->(note:Note)<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch(`(note)<-[upVote:UP_VOTE]-(:User)`)
        .return(`DISTINCT note.noteId AS noteId, note.text AS text, note.created AS created, count(upVote) AS upVotes,
                 creator, EXISTS((:User {userId: {userId}})-[:IS_CREATOR]->(note)) AS isAdmin,
                 EXISTS((creator)-[:IS_CONTACT]->(:User {userId: {userId}})) AS creatorTrustUser,
                 EXISTS((:User {userId: {userId}})-[:UP_VOTE]->(note)) AS hasVoted`)
        .orderBy(getSortOrder(sort))
        .skip(`{page}`)
        .limit(`${PAGE_SIZE}`)
        .end({answerId, page, userId}).send([getTotalNumberOfNotesCommand(answerId)]);
    return {notes: getNotesResponse(response[1], userId), numberOfNotes: response[0][0].numberOfNotes};

};

module.exports = {
    getNotes
};
