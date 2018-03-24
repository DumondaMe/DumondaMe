'use strict';

const getUserId = function (req) {
    let userId = null;
    if(req.user && req.user.id) {
        userId = req.user.id;
    }
    return userId;
};

const getFile = function (req) {
    if (req.files && req.files.file && req.files.file.path) {
        return req.files.file.path;
    }
    return null;
};

module.exports = {
    getUserId,
    getFile
};
