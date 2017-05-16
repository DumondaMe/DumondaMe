'use strict';

let bluebird = require('bluebird');
let neo4j = require('neo4j-driver').v1;
let Promise = bluebird.Promise;
let underscore = require('underscore');
let logger = require('../logging').getLogger(__filename);

let handlingInteger = function (value) {
    if (neo4j.integer.inSafeRange(value)) {
        return value.toNumber();
    }
    return value.toString();
};

let handlingConvert = function (value) {
    if (neo4j.isInt(value)) {
        return handlingInteger(value);
    } else if ((value instanceof neo4j.types.Node || value instanceof neo4j.types.Relationship) &&
        value.properties instanceof Object) {
        let node = value.properties;
        for (let nodePropertyKey in node) {
            if (node.hasOwnProperty(nodePropertyKey)) {
                node[nodePropertyKey] = handlingConvert(node[nodePropertyKey]);
            }
        }
        return node;
    } else if (value instanceof Array) {
        value.forEach(function (arrayValue, index) {
            value[index] = handlingConvert(arrayValue);
        });
    }
    return value;
};

let createJson = function (results) {
    let json = [];

    for (let i = 0; i < results.length; i = i + 1) {
        let row = {}, originalRow = results[i];
        for (let j = 0; j < originalRow.keys.length; j = j + 1) {
            let rowProperty = originalRow.get(j);
            if (rowProperty !== undefined && rowProperty !== null) {
                row[originalRow.keys[j]] = handlingConvert(rowProperty);
            }
        }
        json.push(row);
    }

    return json;
};

let Cypher = function (driver) {
    let chainedQuery = '', paramsToSend = {}, isReadCommand = true;

    this.chainingQuery = function (condition, command) {
        chainedQuery = chainedQuery + command + condition;
        return this;
    };

    this.optionalMatch = function (condition) {
        return this.chainingQuery(condition, ' OPTIONAL MATCH ');
    };

    this.match = function (condition) {
        return this.chainingQuery(condition, ' MATCH ');
    };

    this.where = function (condition) {
        if (condition && condition.trim() !== '') {
            return this.chainingQuery(condition, ' WHERE ');
        }
        return this;
    };

    this.with = function (condition) {
        return this.chainingQuery(condition, ' WITH ');
    };

    this.create = function (condition) {
        return this.chainingQuery(condition, ' CREATE ');
    };

    this.createUnique = function (condition) {
        return this.chainingQuery(condition, ' CREATE UNIQUE ');
    };

    this.foreach = function (condition) {
        return this.chainingQuery(condition, ' FOREACH ');
    };

    this.merge = function (condition) {
        return this.chainingQuery(condition, ' MERGE ');
    };

    this.case = function (condition) {
        return this.chainingQuery(condition, ' CASE ');
    };

    this.when = function (condition) {
        return this.chainingQuery(condition, ' WHEN ');
    };

    this.then = function (condition) {
        return this.chainingQuery(condition, ' THEN ');
    };

    this.delete = function (condition) {
        return this.chainingQuery(condition, ' DELETE ');
    };

    this.remove = function (condition) {
        return this.chainingQuery(condition, ' REMOVE ');
    };

    this.orderBy = function (condition) {
        return this.chainingQuery(condition, ' ORDER BY ');
    };

    this.skip = function (condition) {
        return this.chainingQuery(condition, ' SKIP ');
    };

    this.limit = function (condition) {
        return this.chainingQuery(condition, ' LIMIT ');
    };

    this.unwind = function (condition) {
        return this.chainingQuery(condition, ' UNWIND ');
    };

    this.union = function () {
        chainedQuery = chainedQuery + ' UNION ';
        return this;
    };

    this.unionAll = function () {
        chainedQuery = chainedQuery + ' UNION ALL ';
        return this;
    };

    this.set = function (ref, objectToSet) {

        let setCondition = '', key, propertyAdded = false;
        for (key in objectToSet) {
            if (objectToSet.hasOwnProperty(key)) {
                setCondition = setCondition.concat(ref, '.', key, ' = {', key, '},');
                propertyAdded = true;
                if (objectToSet[key] === undefined) {
                    objectToSet[key] = null;
                }
                paramsToSend[key] = objectToSet[key];
            }
        }
        if (propertyAdded) {
            setCondition = setCondition.slice(0, -1);
            chainedQuery = chainedQuery + ' SET ' + setCondition;
        } else {
            logger.error('Empty object for set condition');
        }
        return this;
    };

    this.replaceArrayElement = function (ref, propertyName, oldElementValue, newElementValue, hasPreviousWhere) {
        let array = ref + '.' + propertyName;
        let oldValueName = propertyName + 'old';
        let newValueName = propertyName + 'new';
        let whereCondition = ' WHERE {' + oldValueName + '} IN ' + array;
        let setCondition = ' SET ' + array + ' = filter(x in ' + array + ' WHERE not(x={' + oldValueName + '})) + {' + newValueName + '}';
        if (hasPreviousWhere) {
            whereCondition = ' AND {' + oldValueName + '} IN ' + array;
        }
        paramsToSend[oldValueName] = oldElementValue;
        paramsToSend[newValueName] = newElementValue;
        chainedQuery = chainedQuery + whereCondition + setCondition;
        return this;
    };

    this.addCommand = function (command) {
        chainedQuery = chainedQuery + command;
        return this;
    };

    this.return = function (returnCondition) {
        chainedQuery = chainedQuery + ' RETURN ' + returnCondition;
        return this;
    };

    this.end = function (params) {
        if (params) {
            paramsToSend = underscore.extend(paramsToSend, params);
        }
        return this;
    };

    this.getCommand = function () {
        return {statement: chainedQuery, parameters: paramsToSend, isReadCommand: isReadCommand};
    };

    this.getCommandString = function () {
        return chainedQuery;
    };

    function chainPromise(promise, results, statementsToSent, session, chainNumber) {

        if (chainNumber <= 0) {
            return promise;
        }

        let next, statement = statementsToSent[statementsToSent.length - chainNumber];

        if (statement.isReadCommand) {
            next = promise.then(function () {
                return session.writeTransaction(function (tx) {
                    return tx.run(statement.statement, statement.parameters);
                }).then(function (result) {
                    results.push(createJson(result.records));
                });
            });
        }

        return next.then(function () {
            return chainPromise(next, results, statementsToSent, session, chainNumber - 1);
        });
    }

    this.send = function (statementsToSend) {
        let results = [];
        const session = driver.session();
        if (!statementsToSend || !(statementsToSend instanceof Array)) {
            statementsToSend = [];
        }
        statementsToSend.push(this.getCommand());

        return chainPromise(Promise.resolve({}), results, statementsToSend, session, statementsToSend.length).then(function () {
            session.close();
            if (results.length === 1) {
                return results[0];
            }
            return results;
        });
    };
};

module.exports = {
    Cypher: Cypher
};
