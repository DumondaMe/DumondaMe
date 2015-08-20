'use strict';

var toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
};

var getToastPosition = function() {
    return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
};

module.exports = ['$mdToast', function ($mdToast) {

    this.showError = function (errorMessage) {
        var toast = $mdToast.simple()
            .content(errorMessage)
            .theme("error-toast")
            .hideDelay(0)
            .action('OK')
            .highlightAction(false)
            .position(getToastPosition());
        $mdToast.show(toast);
    };
}];
