'use strict';

const db = requireDb();
const rp = require('request-promise');
const cheerio = require('cheerio');
const youtubeLink = requireModel('util/youtube');
const vimeoLink = requireModel('util/vimeo');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const LINK = 'Link';
const YOUTUBE = 'Youtube';
const VIMEO = 'Vimeo';

const getTitle = function ($) {
    let title = $("meta[property='og:title']").attr('content');
    if (!title || (typeof title === 'string' && title.trim() === '')) {
        title = $("head title").text() || '';
    }
    title = title.replace(/(- YouTube)+$/, "");
    title = title.trim();
    return title;
};

const getDescription = function ($) {
    let description = $("meta[property='og:description']").attr('content');
    if (!description || (typeof description === 'string' && description.trim() === '')) {
        description = $("meta[name='description']").attr('content') || '';
    }
    description = description.trim();
    return description;
};

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
        response = {title: answer.title, description: answer.description, type: linkType};
        if (linkType === YOUTUBE || linkType === VIMEO) {
            response.linkEmbed = answer.linkEmbed;
        } else if (linkType === LINK) {
            response.pageType = answer.pageType;
            response.imageUrl = `/link/${answer.answerId}/preview.jpg`;
        }
    }
    return response;
};

const searchWebsite = async function (link, linkType) {
    try {
        const $ = cheerio.load(await rp.get(link));
        let result = {title: getTitle($), description: getDescription($), type: linkType};
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

const search = async function (link) {
    let linkType = getLinkType(link);
    let result = await searchDatabase(link, linkType);
    if (!result) {
        result = searchWebsite(link, linkType);
    }
    return result;
};

module.exports = {
    search
};
