'use strict';

var db = require('../../../../../neo4j/index');

module.exports = {
    clearDatabase: function () {
        return db.cypher().match("(n) OPTIONAL MATCH (n)-[r]-() DELETE n,r").send();
    },
    cypher: db.cypher
};