'use strict';


module.exports = [ 'ScrollRequest',
    function (ScrollRequest) {

        this.removeBlog = function (pinwall, blogId) {
            var elementToRemove;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    elementToRemove = pinwallElement;
                }
            });
            if (elementToRemove) {
                pinwall.splice(pinwall.indexOf(elementToRemove), 1);
                ScrollRequest.removedElement('home');
            }
        };

        this.addBlog = function (pinwall, blog) {
            pinwall.unshift(blog);
            ScrollRequest.addedElement('home');
        };
    }];
