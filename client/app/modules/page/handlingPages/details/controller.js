'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['PageCategoryHandler', 'PageHandlingState',
            function (PageCategoryHandler, PageHandlingState) {
                var ctrl = this;
                ctrl.showPreviews = false;
                ctrl.selected = [];

                PageHandlingState.registerStateChange(ctrl);

                ctrl.stateChanged = function (state) {
                    if (state === 3) {
                        ctrl.showPreviews = true;
                        ctrl.selected = PageCategoryHandler.getSelected();
                    } else {
                        ctrl.showPreviews = false;
                    }
                };
            }];
    }
};
