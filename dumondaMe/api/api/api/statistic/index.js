'use strict';

const statistic = requireModel('statistic');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        let response = await statistic.getStatistic();
        res.status(200).json(response);
    }));
};
