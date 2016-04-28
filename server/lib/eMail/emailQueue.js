'use strict';

var kue = require('kue');
var logger = requireLogger.getLogger(__filename);
var emailJobs;
var delay;

var setErrorLog = function (queue) {
    queue.on('error', function (err) {
        logger.error('Error occurred in Email Queue', err);
    });
};

var config = function (conf) {
    emailJobs = kue.createQueue({
        prefix: conf.prefix,
        redis: {
            port: conf.port,
            host: conf.host
        }
    });
    delay = conf.delay;
    setErrorLog(emailJobs);
    logger.info("Email Queue connected to redis: " + conf.host + ":" + conf.port);
};

var createJob = function (description, data) {
    emailJobs.create(description, data).delay(delay).priority('normal').attempts(3).removeOnComplete(true)
        .save(function (err) {
            if (!err) {
                logger.debug("Email queue job successfully finished");
            } else {
                logger.error("Failed to finish email job");
            }
        });
};

var addJobDefinition = function (description, jobFunction) {
    emailJobs.process(description, function (job, done) {
        jobFunction(job.data, done);
    });
};

module.exports = {
    config: config,
    createJob: createJob,
    addJobDefinition: addJobDefinition
};
