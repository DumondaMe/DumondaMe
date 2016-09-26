'use strict';

var logger = requireLogger.getLogger(__filename);
var gm = require('./../../util/gm');
var exceptions = require('./../../../lib/error/exceptions');
var Promise = require('bluebird');
var ERROR_CODE_IMAGE_TO_SMALL = 2;

var checkImageSize = function (titlePicturePath, req) {
    if (titlePicturePath) {
        return gm.gm(titlePicturePath).sizeAsync().then(function (size) {
            if (size.width < 100 || size.height < 160) {
                return exceptions.getInvalidOperation('User tries to add to small image ' + size.width + 'x' + size.height, logger, req,
                    ERROR_CODE_IMAGE_TO_SMALL);
            }
        });
    }
    return Promise.resolve();
};

module.exports = {
    checkImageSize: checkImageSize
};
