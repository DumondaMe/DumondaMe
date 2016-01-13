'use strict';


module.exports = [
    function () {

        this.removeBlog = function (pinwall, blogId) {
            var elementToRemove;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    elementToRemove = pinwallElement;
                }
            });
            if (elementToRemove) {
                pinwall.splice(pinwall.indexOf(elementToRemove), 1);
            }
        };
    }];
