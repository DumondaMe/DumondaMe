'use strict';

let request = require('request');
let promise = require('bluebird');

let Cypher = require('./cypher.js').Cypher;
let helper = require('./helper');
let connectionUrl;

module.exports = {
    cypher: function () {
        return new Cypher(connectionUrl);
    },
    concatCommandsWithAnd: helper.concatCommandsWithAnd,
    connect: function (host) {
        connectionUrl = host + '/db/data/transaction/commit';

        return new promise.Promise(function (resolve, reject) {
            request({
                method: 'GET',
                uri: host
            }, function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                if (res.statusCode === 200) {
                    resolve({});
                    return;
                }
                reject({statusCode: res.statusCode});
            });
        });
    }
};
