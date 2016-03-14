'use strict';

var category = require("../../../../schema/category");

module.exports = {
    id: {type: 'string', format: 'notEmptyString', maxLength: 30},
    category: category.category,
    title: {type: 'string', format: 'notEmptyString', maxLength: 255},
    description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
    link: {type: 'string', format: 'url', maxLength: 1000}
};
