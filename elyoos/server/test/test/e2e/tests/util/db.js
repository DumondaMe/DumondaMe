'use strict';

var db = require('elyoos-server-lib').neo4j;

module.exports = {
    clearDatabase: function () {
        return db.cypher().match("(n) OPTIONAL MATCH (n)-[r]-() DELETE n,r").send();
    },
    cypher: db.cypher
};