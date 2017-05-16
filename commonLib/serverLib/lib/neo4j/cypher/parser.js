'use strict';

let neo4j = require('neo4j-driver').v1;

let handlingInteger = function (value) {
    if (neo4j.integer.inSafeRange(value)) {
        return value.toNumber();
    }
    return value.toString();
};

let handlingResultTypes = function (value) {
    if (neo4j.isInt(value)) {
        return handlingInteger(value);
    } else if ((value instanceof neo4j.types.Node || value instanceof neo4j.types.Relationship) &&
        value.properties instanceof Object) {
        let node = value.properties;
        for (let nodePropertyKey in node) {
            if (node.hasOwnProperty(nodePropertyKey)) {
                node[nodePropertyKey] = handlingResultTypes(node[nodePropertyKey]);
            }
        }
        return node;
    } else if (value instanceof Array) {
        value.forEach(function (arrayValue, index) {
            value[index] = handlingResultTypes(arrayValue);
        });
    }
    return value;
};

let parseResult = function (results) {
    let json = [];

    for (let i = 0; i < results.length; i = i + 1) {
        let row = {}, originalRow = results[i];
        for (let j = 0; j < originalRow.keys.length; j = j + 1) {
            let rowProperty = originalRow.get(j);
            if (rowProperty !== undefined && rowProperty !== null) {
                row[originalRow.keys[j]] = handlingResultTypes(rowProperty);
            }
        }
        json.push(row);
    }

    return json;
};


module.exports = {
    parseResult: parseResult
};
