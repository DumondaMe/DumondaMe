'use strict';

let db = requireDb();
let cdn = require('elyoos-server-lib').cdn;
let detailTitlePicture = require('./../../page/detail/detailTitlePicture');

let handlingPages = function (page) {
    if (page) {
        if (page.label === 'Book') {
            detailTitlePicture.addTitlePicture(page.pageId, page, 'Book');
        } else if(page.label === 'Link') {
            page.imageUrl = cdn.getUrl(`pages/${page.pageId}/normal.jpg`);
        }
    }
};

let getDetail = function (userId, answerId) {

    return db.cypher().match("(answer:ForumAnswer {answerId: {answerId}})")
        .optionalMatch("(answer)<-[rate:RATE_POSITIVE]-(:User)")
        .with("COUNT(rate) AS positiveRating, answer")
        .match("(answer)<-[:IS_ANSWER]-(question:ForumQuestion), (user:User {userId: {userId}})")
        .optionalMatch("(answer)-[:REFERENCE]->(page:Page)")
        .return(`answer.answerId AS answerId, answer.title AS title, answer.description AS description, answer.created AS created, positiveRating, 
            answer.type AS type, question, page,
            EXISTS((answer)<-[:IS_ADMIN]-(user)) AS isAdmin,
            EXISTS((answer)<-[:RATE_POSITIVE]-(user)) AS ratedByUser`)
        .end({answerId: answerId, userId: userId})
        .send().then(function (resp) {
            handlingPages(resp[0].page);
            return {answer: resp[0]};
        });
};


module.exports = {
    getDetail: getDetail
};
