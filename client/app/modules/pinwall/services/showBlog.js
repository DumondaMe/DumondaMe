'use strict';

module.exports = [
    function () {
        this.showElement = function (pinwall, blogElement) {
            var show = true;
            if (blogElement.pinwallType === 'Blog') {
                angular.forEach(pinwall, function (pinwallElement) {
                    if (pinwallElement.pinwallType === 'Recommendation' && pinwallElement.label === 'Blog' &&
                        pinwallElement.pageId === blogElement.pageId) {
                        show = false;
                    }
                });
            }
            return show;
        };
    }];
