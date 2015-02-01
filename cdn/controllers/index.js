'use strict';

var path = require('path');
var validation = require('./../lib/jsonValidation');
var logger = requireLogger.getLogger(__filename);
var exceptions = require('./../lib/error/exceptions');
var moment = require('moment');
var cdnPath = require('./../lib/cdn').getConfig().path;

var schemaRequestImage = {
    name: 'requestImage',
    type: 'object',
    additionalProperties: false,
    required: ['path', 'expires'],
    properties: {
        path: {type: 'string', format: 'notEmptyString', maxLength: 500},
        expires: {type: 'string', format: 'notEmptyString', maxLength: 500}
    }
};

module.exports = function (router) {

    router.get('/', function (req, res) {

        return validation.validateQueryRequest(req, schemaRequestImage, logger).then(function (request) {
            var now = moment.utc().valueOf();
            if (now < parseInt(request.expires, 10)) {
                res.sendFile(path.join(cdnPath, request.path));
            } else {
                logger.warn('Image request is expired', {}, req);
                res.status(401).end();
            }

        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error when getting an image', {error: err}, req);
            res.status(500).end();
        });
    });

};
