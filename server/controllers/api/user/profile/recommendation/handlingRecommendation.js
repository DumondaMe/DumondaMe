'use strict';

var logger = requireLogger.getLogger(__filename);
var user = require('./../../../../../models/user/user');
var exceptions = require('./../../../../../lib/error/exceptions');
var validation = require('./../../../../../lib/jsonValidation');
var recommendation = require('./../../../../../models/recommendation/recommendation');

module.exports = {

    postRecommendation: function (req, res, schemaPostNewProfileData) {

        return validation.validateRequest(req, schemaPostNewProfileData, logger).then(function () {
            return recommendation.saveRecommendation(req.user.id, req.body);
        }).then(function (recommendation) {
            res.json({id: recommendation._id});
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(exceptions.notAllowedRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Post Recommendation failed', {error: err.errors}, req);
            res.status(500).end();
        });
    },
    deleteRecommendation: function (req, res, schemaPostNewProfileData) {
        return validation.validateRequest(req, schemaPostNewProfileData, logger).then(function () {
            return recommendation.deleteRecommendation(req.user.id, req.body.id);
        }).then(function () {
            res.status(200).end();
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(exceptions.notAllowedRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Delete Recommendation failed', {error: err.errors}, req);
            res.status(500).end();
        });
    }
};
