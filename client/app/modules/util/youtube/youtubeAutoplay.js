'use strict';

module.exports = [function () {

    this.getAutoplayLink = function (embeddedImage) {
        return embeddedImage + '?autoplay=1';
    };
}];
