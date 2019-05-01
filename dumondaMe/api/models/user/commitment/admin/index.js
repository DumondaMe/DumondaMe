'use strict';

const addAdmin = require('./add');
const removeAdmin = require('./remove');

const add = async function (userId, newAdminId, commitmentId) {
    await addAdmin.add(userId, newAdminId, commitmentId);
};

const remove = async function (userId, adminIdToRemove, commitmentId) {
    await removeAdmin.remove(userId, adminIdToRemove, commitmentId);
};

module.exports = {
    add,
    remove
};
