'use strict';

module.exports = [function () {

    var service = this, selectedPage;

    service.setSelectedPage = function (newSelectedPage) {
        selectedPage = newSelectedPage;
    };

    service.getSelectedPage = function () {
        return selectedPage;
    };
}];
