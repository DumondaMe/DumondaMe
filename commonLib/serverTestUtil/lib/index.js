"use strict";

let db = require('./db');
let dbDSL = require('./dbDSL');
let generator = require('./generator');
let request = require('./request');
let stubCDN = require('./stubCDN');
let stubEmailQueue = require('./stubEmailQueue');
let stubLimitRate = require('./stubLimitRate');
let stubRecaptcha = require('./stubRecaptcha');
let user = require('./user');
let serverLib;

module.exports.db = db;
module.exports.dbDSL = dbDSL;
module.exports.generator = generator;
module.exports.requestHandler = request;
module.exports.stubCDN = stubCDN;
module.exports.stubEmailQueue = stubEmailQueue;
module.exports.stubLimitRate = stubLimitRate;
module.exports.stubRecaptcha = stubRecaptcha;
module.exports.user = user;

module.exports.init = function (newServerLib, app) {
    if (!serverLib) {
        serverLib = newServerLib;
        db.init(serverLib.neo4j);
        generator.init(serverLib.uuid);
        stubEmailQueue().init(serverLib.eMailQueue);
        stubLimitRate().init(serverLib.limiteRate);
    }
    if (app) {
        request.setApplication(app);
    }
};
