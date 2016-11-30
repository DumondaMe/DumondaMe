'use strict';

module.exports = ['moment', function (moment) {

    this.checkIsNewDay = function (index, messages) {
        var actualMessage, previousMessage;
        if (index === 0) {
            return true;
        }
        previousMessage = moment.unix(messages[index - 1].timestamp).format('l');
        actualMessage = moment.unix(messages[index].timestamp).format('l');
        return previousMessage !== actualMessage;
    };
}];
