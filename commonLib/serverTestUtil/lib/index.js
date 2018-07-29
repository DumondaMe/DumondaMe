"use strict";

let db = require('./db');
let dbDSL = require('./dbDSL');
let generator = require('./generator');
let request = require('./request');
let stubCDN = require('./stubCDN');
let stubLimitRate = require('./stubLimitRate');
let stubRecaptcha = require('./stubRecaptcha');
let user = require('./user');
let serverLib;

module.exports.db = db;
module.exports.dbDSL = dbDSL;
module.exports.generator = generator;
module.exports.requestHandler = request;
module.exports.stubCDN = stubCDN;
module.exports.stubLimitRate = stubLimitRate;
module.exports.stubRecaptcha = stubRecaptcha;
module.exports.user = user;

module.exports.init = function (newServerLib, app) {
    if (!serverLib) {
        serverLib = newServerLib;
        db.init(serverLib.neo4j);
        generator.init(serverLib.uuid);
        stubLimitRate().init(serverLib.limiteRate);
    }
    if (app) {
        request.setApplication(app);
    }
};
