'use strict';

const amazonS3 = require('./amazonS3')
const localStorage = require('./local')

let exportType = null;
if ('localStorage' === process.env.CDN) {
    exportType = localStorage;
} else {
    exportType = amazonS3;
}

module.exports = exportType;
