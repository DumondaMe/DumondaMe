require('dumonda-me-server-lib').init('emailService');
require('fs-extra');

const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const schedule = require('node-schedule');
const dbConfig = require('dumonda-me-server-lib').databaseConfig;

dbConfig.connected.then(async function () {
    logger.info('EMail service started');
    schedule.scheduleJob('*/20 * * * * *', async function () {
        logger.info(`Job is running`);
    });

}).catch(function () {
    logger.error(`Failed to connect to database ${process.env.DATABASE_URL}`);
});

dbConfig.config({host: process.env.DATABASE_URL});