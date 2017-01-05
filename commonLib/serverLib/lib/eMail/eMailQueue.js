'use strict';

let kue = require('kue');
let logger = require('../logging').getLogger(__filename);
let emailJobs;
let delay;

let setErrorLog = function (queue) {
    queue.on('error', function (err) {
        logger.error('Error occurred in Email Queue', err);
    });
};

let config = function (conf) {
    emailJobs = kue.createQueue({
        prefix: conf.prefix,
        redis: {
            port: conf.port,
            host: conf.host
        }
    });
    delay = conf.delay * 1000;
    setErrorLog(emailJobs);
    logger.info("Email Queue connected to redis: " + conf.host + ":" + conf.port);
};

let createJobHandling = function (err) {
    if (!err) {
        logger.debug("Email job successfully started");
    } else {
        logger.error("Failed to start email job");
    }
};

let createJob = function (description, data) {
    emailJobs.create(description, data).delay(delay).priority('normal').attempts(3).removeOnComplete(true)
        .save(function (err) {
            createJobHandling(err);
        });
};

let createImmediatelyJob = function (description, data) {
    emailJobs.create(description, data).priority('normal').attempts(3).removeOnComplete(true)
        .save(function (err) {
            createJobHandling(err);
        });
};

let addJobDefinition = function (description, jobFunction) {
    emailJobs.process(description, function (job, done) {
        jobFunction(job.data, done);
    });
};

module.exports = {
    config: config,
    createJob: createJob,
    createImmediatelyJob: createImmediatelyJob,
    addJobDefinition: addJobDefinition
};
