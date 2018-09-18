'use strict';

let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

let parseString = function (vEvent, property, isMandatory) {
    let index = vEvent.indexOf(property), result = null;
    if (index !== -1) {
        let indexSeparator = vEvent.indexOf(':', index) + 1;
        result = vEvent.substring(indexSeparator, vEvent.indexOf('\n', index));
        result = result.replace('\r', '');
        result = result.replace('\n', '');
    } else if (isMandatory) {
        logger.error(`${property} in ${vEvent} not found`);
    }
    return result;
};

module.exports = {
    parseString
};
