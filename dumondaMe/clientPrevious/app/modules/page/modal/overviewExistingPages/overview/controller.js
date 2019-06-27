'use strict';

module.exports = [
    function () {
        var ctrl = this;
        
        ctrl.pageSelectedChanged = function() {
            var pageCopy = {};
            angular.forEach(ctrl.pages, function (page) {
                page.selectedStyle = false;
            });
            angular.copy(ctrl.pageSelected, pageCopy);
            ctrl.pageSelected.selectedStyle = true;
            ctrl.selectChanged(pageCopy);
        };
    }];

