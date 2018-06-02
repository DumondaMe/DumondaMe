'use strict';

const db = requireDb();
const rp = require('request-promise');
const cheerio = require('cheerio');
const parseWebsite = require('./../website/parse');
const youtubeLink = requireModel('util/youtube');
const vimeoLink = requireModel('util/vimeo');
const exceptions = require('elyoos-server-lib').exceptions;
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const LINK = 'Link';
const YOUTUBE = 'Youtube';
const VIMEO = 'Vimeo';

const ERROR_CODE_NO_YOUTUBE_ID = 1;
const ERROR_CODE_ANSWER_EXISTS = 2;

const getLinkType = function (link) {
    let linkType = LINK;
    if (/\.youtube\.com/igm.test(link) || /youtu\.be/i.test(link)) {
        linkType = YOUTUBE;
    } else if (/vimeo\.com\//igm.test(link)) {
        linkType = VIMEO;
    }
    return linkType;
};

const searchDatabase = async function (link, linkType) {
    let result = await db.cypher().match(`(answer:${linkType} {link: {link}})`)
        .return(`answer`)
        .limit(`1`).end({link}).send();
    let response = null;
    if (result.length === 1) {
        let answer = result[0].answer;
        response = {title: answer.title, type: linkType};
        if (linkType === YOUTUBE || linkType === VIMEO) {
            response.linkEmbed = answer.linkEmbed;
        } else if (linkType === LINK) {
            response.pageType = answer.pageType;
            response.imageUrl = cdn.getPublicUrl(`link/${answer.answerId}/preview.jpg`);
        }
    }
    return response;
};

const searchWebsite = async function (link, linkType) {
    try {
        const $ = cheerio.load(await rp.get(link));
        let result = {title: parseWebsite.getTitle($), type: linkType};
        if (linkType === YOUTUBE) {
            result.linkEmbed = youtubeLink.getEmbedUrl(link)
        } else if (linkType === VIMEO) {
            result.linkEmbed = vimeoLink.getEmbedUrl(link)
        } else if (linkType === LINK) {
            result.imageUrl = $("meta[property='og:image']").attr('content');
            result.pageType = $("meta[property='og:type']").attr('content');
        }
        return result;
    } catch (e) {
        logger.warn(`Could not load link ${link}`);
        throw new Error(`404`);
    }
};

const checkLink = function (link, linkType) {
    if (linkType === YOUTUBE && youtubeLink.getYoutubeId(link) === null) {
        throw new exceptions.InvalidOperation(`No id found for link ${link}`, ERROR_CODE_NO_YOUTUBE_ID);
    }
};

const existsAlreadyForQuestion = async function (link, linkType, questionId) {
    let result = null;
    if (linkType === YOUTUBE) {
        const idOnYoutube = youtubeLink.getYoutubeId(link);
        result = await db.cypher().match(`(:Question {questionId: {questionId}})-[:ANSWER]->
                                              (answer:Youtube {idOnYoutube: {idOnYoutube}})`)
            .return(`answer`).end({idOnYoutube, questionId}).send();
    } else if (linkType === VIMEO) {
        const linkEmbed = vimeoLink.getEmbedUrl(link);
        result = await db.cypher().match(`(:Question {questionId: {questionId}})-[:ANSWER]->
                                              (answer:Vimeo {linkEmbed: {linkEmbed}})`)
            .return(`answer`).end({linkEmbed, questionId}).send();
    } else if (linkType === LINK) {
        result = await db.cypher().match(`(:Question {questionId: {questionId}})-[:ANSWER]->
                                              (answer:Link {link: {link}})`)
            .return(`answer`).end({link, questionId}).send();
    }

    if (result && result.length > 0) {
        throw new exceptions.InvalidOperation(`Link ${link} exists already for question ${questionId}`,
            ERROR_CODE_ANSWER_EXISTS);
    }
};

const search = async function (link, questionId) {
    let linkType = getLinkType(link);
    await existsAlreadyForQuestion(link, linkType, questionId);
    checkLink(link, linkType);
    let result = await searchDatabase(link, linkType);
    if (!result) {
        result = searchWebsite(link, linkType);
    }
    return result;
};

module.exports = {
    search
};
