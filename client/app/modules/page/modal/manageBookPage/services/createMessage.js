'use strict';

module.exports = ['DateConverter', 'Categories', function (DateConverter, Categories) {

    this.getCreateBookPageMessage = function (data) {
        return {
            bookPage: {
                title: data.title,
                description: data.description,
                author: data.author,
                publishDate: DateConverter.convertDisplayToInteger(data.publishDate),
                category: Categories.getCodes(data.selectedCategories)
            }
        };
    };

    this.getModifyBookPageMessage = function (data) {
        return {
            bookPage: {
                pageId: data.pageId,
                description: data.description,
                author: data.author,
                publishDate: DateConverter.convertDisplayToInteger(data.publishDate),
                category: Categories.getCodes(data.selectedCategories)
            }
        };
    };
}];
