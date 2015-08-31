'use strict';

module.exports = ['PageCategoryHandler', 'PageHandlingUpload',
    function (PageCategoryHandler, PageHandlingUpload) {
        var ctrl = this;

        ctrl.uploadPage = function (description, authors, publishDate, imageData) {
            var json = {
                bookPage: {
                    language: PageCategoryHandler.getLanguageCode(),
                    title: PageCategoryHandler.getTitle(),
                    description: description,
                    author: authors
                }
            };
            if (publishDate) {
                json.bookPage.publishDate = publishDate;
            }
            PageHandlingUpload.uploadPage(json, null, 'Book', imageData, false);
        };
    }];
