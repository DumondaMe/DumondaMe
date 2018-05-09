'use strict';

const db = requireDb();
const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');

const PAGE_SIZE = 20;

const getNotesResponse = function (notes) {
    let response = [];
    for (let note of notes) {
        response.push({
            noteId: note.noteId,
            text: note.text,
            textHtml: linkifyHtml(note.text),
            created: note.created,
            upVotes: note.upVotes,
            hasVoted: note.hasVoted,
            isAdmin: note.isAdmin,
            creator: {
                userId: note.creator.userId,
                name: note.creator.name,
                slug: dashify(note.creator.name)
            }
        })
    }
    return response;
};

const getTotalNumberOfNotesCommand = function (answerId) {
    return db.cypher().match(`(answer:Answer {answerId: {answerId}})`)
        .optionalMatch(`(answer)-[:NOTE]->(note:Note)`)
        .return(`count(*) AS numberOfNotes`).end({answerId}).getCommand();
};

const getSortOrder = function (sort) {
  if(sort === 'newest') {
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
                 EXISTS((:User {userId: {userId}})-[:UP_VOTE]->(note)) AS hasVoted`)
        .orderBy(getSortOrder(sort))
        .skip(`{page}`)
        .limit(`${PAGE_SIZE}`)
        .end({answerId, page, userId}).send([getTotalNumberOfNotesCommand(answerId)]);
    return {notes: getNotesResponse(response[1]), numberOfNotes: response[0][0].numberOfNotes};

};

module.exports = {
    getNotes
};
