global.requireLogger = require(__dirname.replace("processing", "") + 'lib/logging');
var logger = requireLogger.getLogger(__filename);
var resizeImages = require('./script/resizeImages');
var bluebird = require('bluebird');
bluebird.promisifyAll(require('gm').prototype);

logger.info('Processing started');

resizeImages.resize();
