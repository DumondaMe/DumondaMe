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

let send = async function (statementsToSend, driver) {
    let results = [];
    const session = driver.session();
    try {
        results = await runCypherCommands(statementsToSend, session);
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
