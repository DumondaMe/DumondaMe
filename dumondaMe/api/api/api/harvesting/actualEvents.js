'use strict';

const actualEvents = requireModel('harvesting/actualEvents');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;


module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        let response = await actualEvents.getEvents();
        res.status(200).json(response);
    }));
};
