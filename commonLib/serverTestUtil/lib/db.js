'use strict';

var db = {};

module.exports = {
    init: function (neo4j) {
        db = neo4j;
    },
    clearDatabase: function () {
        return db.cypher().match("(n) OPTIONAL MATCH (n)-[r]-() DELETE n,r").send();
    },
    cypher: function () {
        return db.cypher();
    }
};