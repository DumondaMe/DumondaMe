'use strict';

module.exports = [function () {

    var needsUpdate = false;

    this.isUpdateRequestPending = function () {
        return needsUpdate;
    };

    this.setUpdateRequested = function (newState) {
        needsUpdate = newState;
    };
}];
