require('dumonda-me-server-lib').init('elyoos');

const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
require('fs-extra');
const process = require('./script/changeUserImages');

const dbConfig = require('dumonda-me-server-lib').databaseConfig;

const runProcess = async function () {
    await process.process();
};

try {
    dbConfig.connected.then(async function () {
        logger.info('Processing started');
        await runProcess();
        process.exit(0);
    });
} catch (error) {
    logger.error(error);
    process.exit(1);
}

dbConfig.config({host: "bolt://localhost:7687"});
