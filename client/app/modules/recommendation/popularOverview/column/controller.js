'use strict';

module.exports = ['PopularRecommendation', function (PopularRecommendation) {
    var ctrl = this;

    ctrl.preview = PopularRecommendation.get({skip: 0, maxItems: 10, onlyContact: false, period: 'all'});
}];
