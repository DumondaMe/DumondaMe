'use strict';

const {URL} = require('url');

let getEmbedUrl = function (link) {
    const vimeoUrl = new URL(link);
    const vimeoId = vimeoUrl.pathname.split('/').pop();
    if (/vimeo\.com\//igm.test(link) && vimeoId) {
        const embedUrl = new URL(`https://player.vimeo.com/video/${vimeoId}`);
        return embedUrl.href;
    }
    return null;
};

module.exports = {
    getEmbedUrl
};
