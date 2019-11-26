'use strict';

const linkifyHtml = require('linkifyjs/html');

const getEditResponse = async function (description) {
    let result = {};
    if (typeof description === 'string') {
        result.descriptionHtml = linkifyHtml(description, {attributes: {rel: 'noopener'}});
    }
    return result
};

module.exports = {
    getEditResponse
};
