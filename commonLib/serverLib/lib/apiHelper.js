'use strict';

const getUserId = function (req) {
    let userId = null;
    if(req.user && req.user.id) {
        userId = req.user.id;
    }
    return userId;
};

module.exports = {
    getUserId
};
