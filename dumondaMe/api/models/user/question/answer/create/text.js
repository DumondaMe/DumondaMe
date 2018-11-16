'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const cdn = require('dumonda-me-server-lib').cdn;
const notification = require(`./notification`);
const youtube = require('../../../../util/youtube');
const slug = require('limax');
const linkify = require('linkifyjs');
const {URL} = require('url');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const searchCommitment = async function (link, questionId) {
    let regex = new URL(link);
    regex = regex.host;
    return await db.cypher().match(`(commitment:Commitment)`)
        .where(`commitment.website =~ {link}`)
        .return(`commitment.commitmentId AS commitmentId, commitment.title AS title, 
                 commitment.description AS description, commitment.modified AS modified,
                 EXISTS((:Question {questionId: {questionId}})-[:ANSWER]->
                 (:CommitmentAnswer)-[:COMMITMENT]->(commitment)) AS usedAsAnswer`)
        .limit(5).end({link: `(?i).*${regex}.*`, questionId}).send();
};

const linkAsAnswerUsedResult = function (result) {
    if (result.length > 0) {
        return {usedAsAnswer: true, answerId: result[0].answer.answerId};
    }
    return {usedAsAnswer: false};
};

const linkUsedAsAnswer = async function (link, questionId) {
    let regex = new URL(link);
    regex = link.slice(regex.protocol.length);
    let result = await db.cypher().match(`(:Question {questionId: {questionId}})-[:ANSWER]->(answer:Answer)`)
        .where(`answer.link =~ {link} AND (answer:Link OR answer:Youtube)`)
        .return(`answer`)
        .limit(1).end({link: `(?i).*${regex}`, questionId}).send();
    return linkAsAnswerUsedResult(result);
};

const youtubeUsedAsAnswer = async function (link, questionId) {
    let idOnYoutube = youtube.getYoutubeId(link);
    let result = await db.cypher()
        .match(`(:Question {questionId: {questionId}})-[:ANSWER]->(answer:Youtube {idOnYoutube: {idOnYoutube}})`)
        .return(`answer`)
        .limit(1).end({questionId, idOnYoutube}).send();
    return linkAsAnswerUsedResult(result);
};

const checkUsedAsAnswer = async function (checkCommand, link, questionId) {
    let linkUsed = await checkCommand(link, questionId);
    return {url: link, usedAsAnswer: linkUsed.usedAsAnswer, answerId: linkUsed.answerId};
};

const addCommitments = function (list, commitments) {
    for (let commitment of commitments) {
        commitment.imageUrl = cdn.getPublicUrl(`commitment/${commitment.commitmentId}/120x120/title.jpg`,
            commitment.modified);
        list.push(commitment);
    }
};

const isYoutubeLink = function (link) {
    if (/\.youtube\.com/i.test(link) && /v=/i.test(link)) {
        return true;
    } else if (/youtu\.be/i.test(link) && /youtu\.be\/[a-zA-Z0-9]{5,}/i.test(link)) {
        return true;
    }
    return false;
};

const getLinksOfAnswer = async function (answer, questionId) {
    let links = linkify.find(answer);
    links = links.filter(link => link.type === 'url').map(link => link.href);
    if (links.length > 0) {
        let result = {links: [], youtube: [], commitment: []};
        for (let link of links) {
            if (isYoutubeLink(link)) {
                result.youtube.push(await checkUsedAsAnswer(youtubeUsedAsAnswer, link, questionId));
            } else {
                let commitments = await searchCommitment(link, questionId);
                if (commitments.length > 0) {
                    addCommitments(result.commitment, commitments);
                }
                result.links.push(await checkUsedAsAnswer(linkUsedAsAnswer, link, questionId));
            }
        }
        return result;
    }
};

const createTextAnswerCommand = function (params) {
    return db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .create(`(answer:Text:Answer {answerId: {answerId}, answer: {answer}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:ANSWER]-(question)`)
        .return(`user.name AS name`)
        .end(params).getCommand();
};

const createTextAnswer = async function (userId, params) {
    let links;
    if (!params.createAnswerWithLink) {
        links = await getLinksOfAnswer(params.answer, params.questionId);
    }
    if (!links) {
        params.answerId = uuid.generateUUID();
        params.created = time.getNowUtcTimestamp();
        params.userId = userId;
        let user = await notification.addCreatedAnswerNotification(userId, params.answerId, params.created)
            .send([createTextAnswerCommand(params)]);
        logger.info(`Created text answer ${params.answerId} for question ${params.questionId}`);
        return {
            answerId: params.answerId, created: params.created,
            creator: {
                name: user[0][0].name,
                slug: slug(user[0][0].name),
                userImage: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/${userId}/profilePreview.jpg`),
                isLoggedInUser: true,
                isTrustUser: false
            }
        };
    }
    return links;
};

module.exports = {
    createTextAnswer
};
