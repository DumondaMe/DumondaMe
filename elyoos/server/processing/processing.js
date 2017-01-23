let logger = require('elyoos-server-lib').logging.getLogger(__filename);
require('fs-extra');
let email = require('./script/sendEmail');
let bluebird = require('bluebird');
bluebird.promisifyAll(require('gm').prototype);

logger.info('Processing started');

email.sendEmail();
