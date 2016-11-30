'use strict';

module.exports = [function () {

    this.getAutoplayLink = function (embeddedLink) {
        var indexList = embeddedLink.indexOf('?list=');
        if(indexList !== -1) {
            return embeddedLink + '&autoplay=1';
        }
        return embeddedLink + '?autoplay=1';
    };
}];
