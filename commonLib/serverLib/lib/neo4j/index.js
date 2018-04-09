'use strict';

let neo4j = require('neo4j-driver').v1;

let Cypher = require('./cypher/index.js').Cypher;
let helper = require('./helper');
let driver;

module.exports = {
    cypher: function () {
        return new Cypher(driver);
    },
    concatCommandsWithAnd: helper.concatCommandsWithAnd,
    connect: function (host) {
        if (process.env.NEO4J_PASSWORD) {
            driver = neo4j.driver(host, neo4j.auth.basic('neo4j', process.env.NEO4J_PASSWORD));
        } else {
            driver = neo4j.driver(host);
        }
        const session = driver.session();
        return session.run('RETURN 1').then(() => {
            session.close();
        });
    },
    closeDriver: function () {
        if (driver && driver.close) {
            driver.close();
        }
    }
};
