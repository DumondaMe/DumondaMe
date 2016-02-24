'use strict';

module.exports = ['$mdToast', function ($mdToast) {

    this.showError = function (errorMessage) {
        var toast = $mdToast.simple()
            .content(errorMessage)
            .theme("error-toast")
            .hideDelay(0)
            .action('OK')
            .highlightAction(false)
            .position('bottom left');
        $mdToast.show(toast);
    };
}];
