'use strict';

var isDateValid = function (moment, date) {
    return moment(date, 'l', moment.locale(), true).isValid();
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategoryHandler', 'PageHandlingState', 'moment', 'PageHandlingUpload',
            function ($scope, PageCategoryHandler, PageHandlingState, moment, PageHandlingUpload) {
                var ctrl = this;

                ctrl.pictureCommands = {};

                PageHandlingState.registerStateChange(this);

                this.stateChanged = function (state) {
                    if (state === 3) {
                        ctrl.showPreviews = true;
                        ctrl.selected = PageCategoryHandler.getSelected();
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
                    var json = {
                        bookPage: {
                            language: PageCategoryHandler.getLanguageCode(),
                            title: PageCategoryHandler.getTitle(),
                            description: ctrl.description,
                            author: ctrl.authors
                        }
                    };
                    if (ctrl.publishDate) {
                        json.bookPage.publishDate = ctrl.publishDate;
                    }
                    PageHandlingUpload.uploadPage(json, null, 'Book', ctrl.pictureCommands.getImageBlob(), false);
                };
            }];
    }
};
