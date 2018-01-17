"use strict";

module.exports.init = function (type) {
    if (type === 'tc') {
        module.exports.asyncMiddleware = require('./asyncMiddleware');

        module.exports.controllerErrors = require('./error/controllerErrors');
        module.exports.errors = require('./error/errors');
        module.exports.exceptions = require('./error/exceptions');

        module.exports.neo4j = require('./neo4j');

        module.exports.databaseConfig = require('./databaseConfig');
        module.exports.jsonValidation = require('./jsonValidation');
        module.exports.limiteRate = require('./limiteRate');
        module.exports.logging = require('./logging');
        module.exports.time = require('./time');
        module.exports.uuid = require('./uuid');
    } else  {
        module.exports.eMail = require('./eMail/eMail');
        module.exports.eMailService = require('./eMail/eMailService/eMail');
        module.exports.eMailQueue = require('./eMail/eMailQueue');

        module.exports.asyncMiddleware = require('./asyncMiddleware');

        module.exports.controllerErrors = require('./error/controllerErrors');
        module.exports.errors = require('./error/errors');
        module.exports.exceptions = require('./error/exceptions');

        module.exports.neo4j = require('./neo4j');

        module.exports.auth = require('./auth');
        module.exports.cdnConfig = require('./cdnConfig');
        module.exports.geocodingConfig = require('./geocodingConfig');
        module.exports.recaptchaConfig = require('./recaptchaConfig');
        module.exports.cdn = require('./cdn');
        module.exports.databaseConfig = require('./databaseConfig');
        module.exports.jsonValidation = require('./jsonValidation');
        module.exports.limiteRate = require('./limiteRate');
        module.exports.logging = require('./logging');
        module.exports.passwordEncryption = require('./passwordEncryption');
        module.exports.redisSession = require('./redisSession');
        module.exports.spec = require('./spec');
        module.exports.time = require('./time');
        module.exports.user = require('./user');
        module.exports.uuid = require('./uuid');
        module.exports.domain = require('./domain');
    }
};
