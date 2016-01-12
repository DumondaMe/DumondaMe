'use strict';

module.exports = ['$scope', 'dateFormatter', '$mdDialog', 'userInfo', 'FileReader', 'FileReaderUtil', 'CreateBlogVisibility',
    function ($scope, dateFormatter, $mdDialog, userInfo, FileReader, FileReaderUtil, CreateBlogVisibility) {
        var ctrl = this;
        ctrl.mainView = true;
        ctrl.createBlogCommands = {};

        ctrl.openVisibility = function () {
            ctrl.mainView = false;
        };

        ctrl.closeVisibility = function () {
            ctrl.mainView = true;
            ctrl.createBlogCommands.activateVisibility();
            /*if (CreateBlogVisibility.isPublic()) {
                ctrl.visibility = "Alle";
            } else {
                ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
            }*/
        };
    }];

