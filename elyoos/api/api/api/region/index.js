'use strict';

const region = requireModel('region/region');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let response = await region.getRegions();
        res.status(200).json(response);
    }));
};
