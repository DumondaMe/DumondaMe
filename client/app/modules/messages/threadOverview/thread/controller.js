'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter',
            function (dateFormatter) {
                var ctrl = this;

                ctrl.getFormattedDate = dateFormatter.format;
            }];
    }
};

