'use strict';

const sharp = require('sharp');
const cdn = require('./cdn');
const rp = require('request');
const Promise = require('bluebird');
const exceptions = require('./error/exceptions');
const logger = require('./logging').getLogger(__filename);

const getResizeOptions = function (width, height, fit) {
    let resizeOptions = {
        background: {r: 255, g: 255, b: 255, alpha: 0},
        withoutEnlargement: true,
        fit: sharp.fit.cover
    };

    if (typeof width === 'number') {
        resizeOptions.width = width;
    }
    if (typeof height === 'number') {
        resizeOptions.height = height;
    }
    if (typeof fit === 'string') {
        resizeOptions.fit = fit;
    }
    return resizeOptions;
};

const uploadImage = async function (width, height, options) {
    let imageBuffer = await sharp(options.originalImagePath)
        .flatten({background: {r: 255, g: 255, b: 255}})
        .resize(getResizeOptions(width, height, options.fit))
        .jpeg({quality: options.quality}).toBuffer();
    await cdn.uploadBuffer(imageBuffer, options.cdnPath, options.bucket);
};

const uploadingExternalImage = async function (width, height, uri, options) {
    try {
        return await new Promise(function (resolve, reject) {
            if (uri) {
                rp.get(uri, function (err) {
                    if (err) {
                        reject(err);
                    }
                }).pipe(sharp().flatten({background: {r: 255, g: 255, b: 255}})
                    .resize(getResizeOptions(width, height)).jpeg({quality: options.quality})
                    .toBuffer(async function (err, buffer) {
                        if (err) {
                            reject(err);
                        }
                        await cdn.uploadBuffer(buffer, options.cdnPath, options.bucket);
                        resolve(buffer);
                    }));
            } else {
                resolve();
            }
        });
    } catch (error) {
        logger.error(`Failed to get image ${uri}`, error);
    }
};

const ERROR_CODE_IMAGE_TO_SMALL = 1;

const checkImageMinWidth = async function (image, minWidth, req) {
    if (image) {
        let metadata = await sharp(image).metadata();
        if (metadata.width < minWidth) {
            return new exceptions.getInvalidOperation(`Image ist to small ${metadata.width}. Min width is ${minWidth}`,
                logger, req, ERROR_CODE_IMAGE_TO_SMALL);
        }
    }
};

module.exports = {
    uploadImage,
    uploadingExternalImage,
    checkImageMinWidth
};
