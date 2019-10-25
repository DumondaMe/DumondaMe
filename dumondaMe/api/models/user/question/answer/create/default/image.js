'use strict';

const image = require('dumonda-me-server-lib').image;


const uploadImages = async function (imagePath, answerId) {
    if (typeof imagePath === 'string') {
        await image.uploadImage(2000, 3200, {
            quality: 80, originalImagePath: imagePath, cdnPath: `defaultAnswer/${answerId}/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC, fit: 'inside'
        });
        await image.uploadImage(500, 800, {
            quality: 80, originalImagePath: imagePath, cdnPath: `defaultAnswer/${answerId}/500x800/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC, fit: 'inside'
        });
        await image.uploadImage(1000, 1600, {
            quality: 80, originalImagePath: imagePath, cdnPath: `defaultAnswer/${answerId}/1000x1600/title.jpg`,
            bucket: process.env.BUCKET_PUBLIC, fit: 'inside'
        });
    }
};

const checkImageMinWidth = async function (titleImage, width, req) {
    if (typeof titleImage === 'string') {
        await image.checkImageMinWidth(titleImage, width, req)
    }
};

module.exports = {
    uploadImages,
    checkImageMinWidth
};
