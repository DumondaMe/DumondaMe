'use strict';

var request = require('request');
var promise = require('bluebird');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var createJson = function (result) {
    var json = [], row, i, j;

    for (i = 0; i < result.data.length; i = i + 1) {
        row = {};
        for (j = 0; j < result.data[i].row.length; j = j + 1) {
            if (result.data[i].row[j] !== undefined && result.data[i].row[j] !== null) {
                row[result.columns[j]] = result.data[i].row[j];
            }
        }
        json.push(row);
    }

    return json;
};

var Cypher = function (connectionUrl) {
    var chainedQuery = '', paramsToSend = {};

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

    this.union = function () {
        chainedQuery = chainedQuery + ' UNION ';
        return this;
    };

    this.unionAll = function () {
        chainedQuery = chainedQuery + ' UNION ALL ';
        return this;
    };

    this.set = function (ref, objectToSet) {

        var setCondition = '', key, propertyAdded = false;
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
        var array = ref + '.' + propertyName;
        var oldValueName = propertyName + 'old';
        var newValueName = propertyName + 'new';
        var whereCondition = ' WHERE {' + oldValueName + '} IN ' + array;
        var setCondition = ' SET ' + array + ' = filter(x in ' + array + ' WHERE not(x={' + oldValueName + '})) + {' + newValueName + '}';
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
        return {statement: chainedQuery, parameters: paramsToSend};
    };

    this.getCommandString = function () {
        return chainedQuery;
    };

    this.send = function (statementsToSend) {
        var multiDataResponse = [];
        if (!statementsToSend || !(statementsToSend instanceof Array)) {
            statementsToSend = [];
        }
        statementsToSend.push(this.getCommand());
        return new promise.Promise(function (resolve, reject) {
            request({
                method: 'POST',
                uri: connectionUrl,
                json: {
                    statements: statementsToSend
                },
                headers: {
                    'X-Stream': true,
                    Accept: 'application/json'
                }
            }, function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                if (res.body.errors.length > 0) {
                    reject(res.body.errors);
                    return;
                }
                if (res.statusCode === 200 && res.body.results.length === 1) {

                    resolve(createJson(res.body.results[0]));
                    return;
                }
                if (res.statusCode === 200 && res.body.results.length > 1) {
                    underscore.each(res.body.results, function (result) {
                        multiDataResponse.push(createJson(result));
                    });
                    resolve(multiDataResponse);
                    return;
                }
                reject({statusCode: res.statusCode});
            });
        });
    };
};

module.exports = {
    Cypher: Cypher
};
