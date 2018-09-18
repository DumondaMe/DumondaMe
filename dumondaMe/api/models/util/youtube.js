'use strict';

const {URL} = require('url');

let getYoutubeId = function (link) {
    const youtubeUrl = new URL(link);
    let youtubeId = null;
    if (/\.youtube\.com/i.test(link)) {
        youtubeId = youtubeUrl.searchParams.get(`v`);
    } else if (/youtu\.be/i.test(link)) {
        youtubeId = youtubeUrl.pathname.substr(1);
    }
    return youtubeId;
};

let getEmbedUrl = function (link) {
    const youtubeId = getYoutubeId(link);
    if (youtubeId) {
        const youtubeUrl = new URL(link);
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
    getEmbedUrl,
    getYoutubeId
};
