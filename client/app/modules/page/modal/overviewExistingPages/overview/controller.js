'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.pageSelected = function(selectedPage) {
            var pageCopy = {};
            if(ctrl.hasSelect === true) {
                angular.forEach(ctrl.pages, function (page) {
                    page.selectedStyle = false;
                });
                angular.copy(selectedPage, pageCopy);
                selectedPage.selectedStyle = true;
                ctrl.selectChanged(pageCopy);
            }
        }
    }];

