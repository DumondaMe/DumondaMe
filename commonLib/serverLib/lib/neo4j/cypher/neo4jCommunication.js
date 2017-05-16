'use strict';

let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let parser = require('./parser');

function chainPromise(promise, results, statementsToSent, session, chainNumber) {

    if (chainNumber <= 0) {
        return promise;
    }

    let next, statement = statementsToSent[statementsToSent.length - chainNumber], sessionCommand;

    if (statement.isWriteCommand) {
        sessionCommand = session.writeTransaction;
    } else {
        sessionCommand = session.readTransaction;
    }
    next = promise.then(function () {
        return sessionCommand.call(session, function (tx) {
            return tx.run(statement.statement, statement.parameters);
        }).then(function (result) {
            results.push(parser.parseResult(result.records));
        });
    });

    return next.then(function () {
        return chainPromise(next, results, statementsToSent, session, chainNumber - 1);
    });
}

let send = function (statementsToSend, driver) {
    let results = [];
    const session = driver.session();

    return chainPromise(Promise.resolve({}), results, statementsToSend, session, statementsToSend.length).then(function () {
        session.close();
        if (results.length === 1) {
            return results[0];
        }
        return results;
    });
};


module.exports = {
    send: send
};
