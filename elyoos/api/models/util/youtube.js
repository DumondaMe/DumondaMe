'use strict';

const {URL} = require('url');

let getYoutubeId = function (youtubeUrl, link) {
    let youtubeId = null;
    if (/\.youtube\.com/i.test(link)) {
        youtubeId = youtubeUrl.searchParams.get(`v`);
    } else if (/youtu\.be/i.test(link)) {
        youtubeId = youtubeUrl.pathname.substr(1);
    }
    return youtubeId;
};

let getEmbedUrl = function (link) {
    const youtubeUrl = new URL(link);
    const youtubeId = getYoutubeId(youtubeUrl, link);
    if (youtubeId) {
        const youtubeListId = youtubeUrl.searchParams.get(`list`);
        const embedUrl = new URL(`https://www.youtube.com/embed/${youtubeId}`);
        if (youtubeListId) {
            embedUrl.searchParams.append('list', youtubeListId);
        }
        return embedUrl.href;
    }
    return null;
};

module.exports = {
    getEmbedUrl
};
