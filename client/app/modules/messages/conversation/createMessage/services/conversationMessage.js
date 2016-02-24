'use strict';

module.exports = [function () {

    this.getMessage = function (isGroupThread, threadId, newMessage) {
        var message;
        if (isGroupThread) {
            message = {
                addGroupMessage: {
                    threadId: threadId,
                    text: newMessage
                }
            };
        } else {
            message = {
                addMessageToThread: {
                    threadId: threadId,
                    text: newMessage
                }
            };
        }
        return message;
    };

}];
