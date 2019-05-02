'use strict';

const admins = require('./admins');
const addAdmin = require('./add');
const removeAdmin = require('./remove');
const confirmAdmin = require('./confirmAdmin');

const getAdmins = async function (userId, commitmentId) {
    return await admins.getAdmins(userId, commitmentId);
};

const add = async function (userId, newAdminId, commitmentId) {
    await addAdmin.add(userId, newAdminId, commitmentId);
};

const remove = async function (userId, adminIdToRemove, commitmentId) {
    await removeAdmin.remove(userId, adminIdToRemove, commitmentId);
};
const confirmToAddAdminToCommitment = async function (userId, notificationId, confirmToBeAdmin) {
    await confirmAdmin.confirmToAddAdminToCommitment(userId, notificationId, confirmToBeAdmin);
};

module.exports = {
    getAdmins,
    add,
    remove,
    confirmToAddAdminToCommitment
};
