'use strict';

var removeUnusedProperties = function (collection) {
    angular.forEach(collection, function (element) {
        delete element.$$mdSelectId;
    });
};

module.exports = [function () {

    this.setFilter = function (filter) {
        removeUnusedProperties(filter.selectedLanguages);
        removeUnusedProperties(filter.selectedTopics);
        removeUnusedProperties(filter.selectedLanguages);
        removeUnusedProperties(filter.selectedRecommendationTypes);
        localStorage.setItem("filter", JSON.stringify(filter));
    };

    this.getFilter = function () {
        var filter = localStorage.getItem("filter");
        if (!filter) {
            filter = {onlyContact: false};
        } else {
            filter = JSON.parse(filter);
        }
        return filter;
    };

    this.setFilterOrder = function (filter) {
        localStorage.setItem("filterOrder", JSON.stringify(filter));
    };

    this.getFilterOrder = function () {
        var filter = localStorage.getItem("filterOrder");
        if (!filter) {
            filter = 'new';
        } else {
            filter = JSON.parse(filter);
        }
        return filter;
    };
}];
