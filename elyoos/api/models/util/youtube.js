'use strict';

const {URL} = require('url');

let getEmbedUrl = function (link) {
    const youtubeUrl = new URL(link);
    const youtubeId = youtubeUrl.searchParams.get(`v`);
    if (/\.youtube\.com\/watch/igm.test(link) && youtubeId) {
        const youtubeListId = youtubeUrl.searchParams.get(`list`);
        const embedUrl = new URL(`https://www.youtube.com/embed/${youtubeId}`);
        if(youtubeListId) {
            embedUrl.searchParams.append('list', youtubeListId);
        }
        return embedUrl.href;
    }
    return null;
};

module.exports = {
    getEmbedUrl
};
