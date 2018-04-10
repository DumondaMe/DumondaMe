'use strict';

const db = requireDb();
const rp = require('request-promise');
const parseWebsite = require('./../website/parse');
const cheerio = require('cheerio');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const searchDatabase = async function (link) {
    let result = await db.cypher().match(`(answer:Commitment {website: {link}})`)
        .return(`answer.answerId AS answerId, answer.title AS title, answer.description AS description`)
        .limit(`1`).end({link}).send();
    if (result.length === 1) {
        return result[0];
    }
};

const searchWebsite = async function (link) {
    try {
        const $ = cheerio.load(await rp.get(link));
        return {
            title: parseWebsite.getTitle($),
            description: parseWebsite.getDescription($),
            imageUrl: null,
            lang: parseWebsite.getLanguage($)
        };
    } catch (e) {
        logger.warn(`Could not load website ${link} for commitment`);
        return {};
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
