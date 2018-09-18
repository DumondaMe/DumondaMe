'use strict';

const Promise = require('bluebird');
const rp = require('request');
const sharp = require('sharp');
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);


const uploadPreviewImage = async function (uploadKey, originalImageUrl, width, height) {
    try {
        return await new Promise(function (resolve, reject) {
            if (originalImageUrl) {
                rp.get(originalImageUrl, function (err) {
                    if (err) {
                        reject(err);
                    }
                }).pipe(sharp().background({r: 255, g: 255, b: 255, alpha: 0}).flatten()
                    .resize(width, height).max().jpeg({quality: 94})
                    .withoutEnlargement().toBuffer(async function (err, buffer) {
                        if (err) {
                            reject(err);
                        }
                        await cdn.uploadBuffer(buffer, uploadKey, process.env.BUCKET_PUBLIC);
                        resolve(buffer);
                    }));
            } else {
                resolve();
            }
        });
    } catch (error) {
        logger.error(`Failed to get image ${originalImageUrl}`, error);
    }
};

module.exports = {
    uploadPreviewImage
};
