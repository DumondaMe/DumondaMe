'use strict';


module.exports = [ 'Observables',
    function (Observables) {

        var observables = [];

        this.register = function (name, observable) {
            Observables.register(observables, name, observable);
        };
        
        this.removeBlog = function (pinwall, blogId) {
            var elementToRemove;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    elementToRemove = pinwallElement;
                }
            });
            if (elementToRemove) {
                pinwall.splice(pinwall.indexOf(elementToRemove), 1);
                Observables.notifyObservables(observables, 'removedBlog');
            }
        };

        this.addBlog = function (pinwall, blog) {
            pinwall.unshift(blog);
            Observables.notifyObservables(observables, 'addedBlog');
        };
    }];
