'use strict';

var logger = requireLogger.getLogger(__filename);

var getThreadCondition = function (isGroupThread) {
    var threadTyp;
    if (isGroupThread) {
        threadTyp = 'thread:GroupThread';
    } else {
        threadTyp = 'thread:Thread';
    }
    return threadTyp;
};

module.exports = {
    getThreadCondition: getThreadCondition
};
