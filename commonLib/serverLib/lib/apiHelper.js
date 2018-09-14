'use strict';

const getUserId = function (req) {
    let userId = null;
    if(req.user && req.user.id) {
        userId = req.user.id;
    }
    return userId;
};

const isSuperUser = function (req) {
    let superUser = false;
    if(req.user && req.user.superUser) {
        superUser = req.user.superUser;
    }
    return superUser;
};

const getFile = function (req) {
    if (req.files && req.files.file && req.files.file.path) {
        return req.files.file.path;
    }
    return null;
};

module.exports = {
    getUserId,
    isSuperUser,
    getFile
};
