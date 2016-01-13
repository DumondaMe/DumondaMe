'use strict';


module.exports = [ 'HomePinwallRequest',
    function (HomePinwallRequest) {

        this.removeBlog = function (pinwall, blogId) {
            var elementToRemove;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    elementToRemove = pinwallElement;
                }
            });
            if (elementToRemove) {
                pinwall.splice(pinwall.indexOf(elementToRemove), 1);
                HomePinwallRequest.removedElement();
            }
        };

        this.addBlog = function (pinwall, blog) {
            pinwall.unshift(blog);
            HomePinwallRequest.addedElement();
        };
    }];
