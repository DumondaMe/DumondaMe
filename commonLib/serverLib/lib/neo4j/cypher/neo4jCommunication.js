'use strict';

let parser = require('./parser');
let logger = require('./../../logging').getLogger(__filename);

async function runCypherCommands(statementsToSend, session) {
    let results = [];
    for (let index = 0; index < statementsToSend.length; index++) {
        let result, statement = statementsToSend[index];
        if (statement.isWriteCommand) {
            result = await session.writeTransaction(tx => tx.run(statement.statement, statement.parameters));
        } else {
            result = await session.readTransaction(tx => tx.run(statement.statement, statement.parameters));
        }
        results.push(parser.parseResult(result.records));
    }
    return results;
}

async function runCypherCommandsWithTransaction(statementsToSend, session) {
    let results = [], tx = session.beginTransaction();
    try {
        for (let index = 0; index < statementsToSend.length; index++) {
            let result, statement = statementsToSend[index];
            result = await tx.run(statement.statement, statement.parameters);
            results.push(parser.parseResult(result.records));
        }
        await tx.commit();
    } catch (error) {
        logger.error(error);
        await tx.rollback();
    }
    return results;
}

let useTransaction = function (statementsToSend) {
    let numberOfWriteCommands = 0;
    for (let statement of statementsToSend) {
        if (statement.isWriteCommand) {
            numberOfWriteCommands++;
        }
    }
    return numberOfWriteCommands >= 2;
};

let send = async function (statementsToSend, driver) {
    let results = [];
    const session = driver.session();
    try {
        if (useTransaction(statementsToSend)) {
            results = await runCypherCommandsWithTransaction(statementsToSend, session);
        } else {
            results = await runCypherCommands(statementsToSend, session);
        }
    } catch (ex) {
        logger.error(ex);
    }
    session.close();
    if (results.length === 1) {
        return results[0];
    }
    return results;
};


module.exports = {
    send: send
};
