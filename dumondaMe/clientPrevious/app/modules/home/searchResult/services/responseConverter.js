'use strict';

module.exports = [function () {

    this.convert = function (resp) {
        var data = {users: [], books: [], youtube: [], links: [], blog: [], hasResults: resp.length > 0};
        angular.forEach(resp, function(element) {
            if(element.hasOwnProperty('pageId')) {
                if(element.label === 'Book') {
                    data.books.push(element);
                } else if(element.label === 'Youtube') {
                    data.youtube.push(element);
                } else if(element.label === 'Link') {
                    data.links.push(element);
                } else if(element.label === 'Blog') {
                    data.blog.push(element);
                }
            } else if(element.hasOwnProperty('userId')) {
                data.users.push(element);
            }
        });
        return data;
    };
}];
