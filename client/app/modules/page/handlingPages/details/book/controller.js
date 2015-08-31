'use strict';

var isDateValid = function (moment, date) {
    return moment(date, 'l', moment.locale(), true).isValid();
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageHandlingState', 'moment', 'UploadBookPage',
            function ($scope, PageHandlingState, moment, UploadBookPage) {
                var ctrl = this;

                ctrl.pictureCommands = {};

                PageHandlingState.registerStateChange(this);

                this.stateChanged = function (state) {
                    if (state === 3) {
                        ctrl.showPreviews = true;
                    } else {
                        ctrl.showPreviews = false;
                    }
                };

                this.publishDateChanged = function () {
                    if (ctrl.publishDate) {
                        $scope.commonForm.inputPublicationDate.$setValidity('custom', isDateValid(moment, ctrl.publishDate));
                    } else if (!ctrl.publishDate || ctrl.publishDate.trim() === '') {
                        $scope.commonForm.inputPublicationDate.$setValidity('custom', true);
                    }
                };

                this.getDateExample = function () {
                    var unixTimestamp = 385974036;
                    return moment.unix(unixTimestamp).format('l');
                };

                this.uploadPage = function () {
                    UploadBookPage.uploadPage(ctrl.description, ctrl.authors, ctrl.publishDate, ctrl.pictureCommands.getImageBlob());
                };
            }];
    }
};
