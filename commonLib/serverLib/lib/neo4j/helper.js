'use strict';

var concatCommandsWithAnd = function (commands) {
    var result = null, i, command;
    for (i = 0; i < commands.length; i++) {
        command = commands[i];
        if (command && result === null) {
            result = command;
        } else if (command && result) {
            result = result + " AND " + command;
        }
    }
    return result;
};

module.exports = {
    concatCommandsWithAnd: concatCommandsWithAnd
};
