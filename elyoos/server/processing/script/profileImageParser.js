'use strict';

var _ = require('lodash');

var getProfileImages = function (contents) {
    var userImages = {};
    _.forEach(contents, function (content) {
        var id;
        if (content.Key.match(/profileImage\/[a-zA-Z0-9]{16,}\//)) {
            id = content.Key.substring(13, 13 + 16);
            userImages[id] = {};
        }
    });
    return userImages;
};


module.exports = {
    getProfileImages: getProfileImages
};
