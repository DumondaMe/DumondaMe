'use strict';

require('dumonda-me-server-lib').init('emailService');
require('fs-extra');

global.requireDb = function () {
    return require('dumonda-me-server-lib').neo4j;
};

const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const schedule = require('node-schedule');
const dbConfig = require('dumonda-me-server-lib').databaseConfig;

const notifications = require('./src/notifications');

dbConfig.connected.then(async function () {
    logger.info('EMail service started');
    schedule.scheduleJob(process.env.JOB_SCHEDULE, async function () {
        try {
            logger.info(`The job to send unread notifications was started.`);
            await notifications.sendUnreadNotifications();
        } catch (error) {
            logger.error(`The job to send unread notifications failed.`, {}, error);
        }
    });

}).catch(function () {
    logger.error(`Failed to connect to database ${process.env.DATABASE_URL}`);
});

dbConfig.config({host: process.env.DATABASE_URL});