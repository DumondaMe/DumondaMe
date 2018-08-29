'use strict';

const db = requireDb();
const rp = require('request-promise');
const dashify = require('dashify');
const cdn = require('elyoos-server-lib').cdn;
const parseWebsite = require('./../website/parse');
const cheerio = require('cheerio');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const WEBSITE_LOAD_FAILED = 1;

const searchDatabase = async function (link) {
    let result = await db.cypher().match(`(c:Commitment {website: {link}})`)
        .return(`c.commitmentId AS commitmentId, c.title AS title, c.description AS description, c.modified AS modified`)
        .limit(`1`).end({link}).send();
    if (result.length === 1) {
        result[0].slug = dashify(result[0].title);
        result[0].imageUrl = cdn.getPublicUrl(`commitment/${result[0].commitmentId}/210x210/title.jpg`);
        if(result[0].modified) {
            result[0].imageUrl = `${result[0].imageUrl}?v=${result[0].modified}`
        }
        return result[0];
    }
};

const searchWebsite = async function (link) {
    let pattern = /^(http|https):\/\//i;
    let requestLink = link;
    if (!pattern.test(link)) {
        requestLink = `https://${link}`;
    }
    let res = await requestWebsite(requestLink);
    if (res.error && requestLink !== link) {
        requestLink = `http://${link}`;
        res = await requestWebsite(requestLink);
    }
    if (!res.error) {
        res.link = requestLink;
    }
    return res;
};

const requestWebsite = async function (link) {
    try {
        let response = await rp.get(link);
        const $ = cheerio.load(response);
        return {
            title: parseWebsite.getTitle($),
            description: parseWebsite.getDescription($),
            imageUrl: null,
            lang: parseWebsite.getLanguage($)
        };
    } catch (e) {
        logger.warn(`Could not load website ${link} for commitment`);
        return {error: WEBSITE_LOAD_FAILED};
    }
};

const getPreview = async function (link) {
    let resultDatabase = await searchDatabase(link);
    let result = await searchWebsite(link);
    if (resultDatabase) {
        result.existingCommitment = resultDatabase;
    }
    return result;
};

module.exports = {
    getPreview
};
