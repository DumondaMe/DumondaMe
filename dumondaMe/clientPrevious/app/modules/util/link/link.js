'use strict';

module.exports = ['$window', function ($window) {

    this.open = function (link) {

        if (!link.match(/^https?:\/\//i)) {
            link = 'http://' + link;
        }
        $window.open(link, '_blank');
    };
}];
