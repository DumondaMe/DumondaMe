'use strict';

module.exports = [function () {


    this.getMessage = function (destinationUserId, threadId, newMessage) {
        var message;
        if (destinationUserId) {
            message = {
                addMessageUser: {
                    userId: destinationUserId,
                    text: newMessage
                }
            };
        } else {
            message = {
                addMessageThread: {
                    threadId: threadId,
                    text: newMessage
                }
            };
        }
        return message;
    };

}];
