'use strict';

let underscore = require('underscore');
let logger = require('../../logging').getLogger(__filename);
let communication = require('./neo4jCommunication');

let Cypher = function (driver) {
    let chainedQuery = '', paramsToSend = {}, isWriteCommand = false;

    this.chainingQuery = function (condition, command, isWrite) {
        if (isWrite) {
            isWriteCommand = true;
        }
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
        return this.chainingQuery(condition, ' CREATE ', true);
    };

    this.createUnique = function (condition) {
        return this.chainingQuery(condition, ' CREATE UNIQUE ', true);
    };

    this.foreach = function (condition, isWrite = true) {
        return this.chainingQuery(condition, ' FOREACH ', isWrite);
    };

    this.merge = function (condition) {
        return this.chainingQuery(condition, ' MERGE ', true);
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
        return this.chainingQuery(condition, ' DELETE ', true);
    };

    this.remove = function (condition) {
        return this.chainingQuery(condition, ' REMOVE ', true);
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
            isWriteCommand = true;
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
        isWriteCommand = true;
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
        return {statement: chainedQuery, parameters: paramsToSend, isWriteCommand: isWriteCommand};
    };

    this.getCommandString = function () {
        return chainedQuery;
    };

    this.send = function (statementsToSend) {
        if (!statementsToSend || !(statementsToSend instanceof Array)) {
            statementsToSend = [];
        }
        statementsToSend.push(this.getCommand());
        return communication.send(statementsToSend, driver);
    };
};

module.exports = {
    Cypher: Cypher
};
