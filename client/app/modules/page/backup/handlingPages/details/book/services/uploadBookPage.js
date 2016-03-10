'use strict';

module.exports = ['PageCategoryHandler', 'PageHandlingUpload', 'moment',
    function (PageCategoryHandler, PageHandlingUpload, moment) {
        var ctrl = this;

        ctrl.uploadPage = function (description, authors, publishDate, imageData, pageId) {
            var json = {
                bookPage: {
                    language: PageCategoryHandler.getLanguageCode(),
                    title: PageCategoryHandler.getTitle(),
                    description: description,
                    author: authors
                }
            };
            if (publishDate) {
                json.bookPage.publishDate = moment.utc(publishDate, 'l', moment.locale(), true).valueOf() / 1000;
            }
            if (pageId) {
                json.bookPage.pageId = pageId;
            }
            PageHandlingUpload.uploadPage(json, pageId, 'Book', imageData);
        };
    }];
