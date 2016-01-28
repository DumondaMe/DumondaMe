'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ContactStatistic',
            function (ContactStatistic) {
                var ctrl = this;

                ctrl.statistics = ContactStatistic.get();
            }];
    }
};

