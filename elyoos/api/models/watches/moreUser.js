'use strict';

const getHasMoreUsers = function (users, pageSize) {
    if (users.length > pageSize) {
        users.pop();
        return true;
    }
    return false;
};

module.exports = {
    getHasMoreUsers
};
