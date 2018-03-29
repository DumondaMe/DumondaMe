require('elyoos-server-lib').init('elyoos');

const logger = require('elyoos-server-lib').logging.getLogger(__filename);
require('fs-extra');
const copyCommitments = require('./script/copyCommitments');
const bluebird = require('bluebird');
bluebird.promisifyAll(require('gm').prototype);

const dbConfig = require('elyoos-server-lib').databaseConfig;

const runProcess = async function () {
    await copyCommitments.processCommitment();
};

try {
    dbConfig.connected.then(async function () {
        logger.info('Processing started');
        await runProcess();
        process.exit(0);
    });
} catch(error) {
    logger.error(error);
    process.exit(1);
}

dbConfig.config({host: "bolt://localhost:7687"});
