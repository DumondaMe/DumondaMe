'use strict';

module.exports = ['$mdToast', function ($mdToast) {

    this.showError = function (errorMessage) {
        var toast = $mdToast.simple()
            .content(errorMessage)
            .theme("error-toast")
            .hideDelay(0)
            .action('OK')
            .highlightAction(false)
            .position('left bottom');
        $mdToast.show(toast);
    };

    this.showWarning = function (errorMessage) {
        var toast = $mdToast.simple()
            .content(errorMessage)
            //.theme("error-toast")
            .hideDelay(0)
            .action('OK')
            .highlightAction(false)
            .position('left bottom');
        $mdToast.show(toast);
    };
}];
