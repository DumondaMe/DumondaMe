'use strict';

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

const getLanguage = function ($) {
    let language  = $("html").attr('lang') || null;
    if(language && language.length > 2) {
        language = language.substring(0, 2);
    }
    return language;
};

module.exports = {
    getTitle,
    getDescription,
    getLanguage
};
