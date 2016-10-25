'use strict';

module.exports = ['DateConverter', 'Topics', function (DateConverter, Topics) {

    this.getCreatePlacePageMessage = function (data) {
        return {
            bookPage: {
                title: data.title,
                description: data.description,
                author: data.author,
                publishDate: DateConverter.convertDisplayToInteger(data.publishDate),
                topic: Topics.getCodes(data.selectedTopics),
                language: data.selectedLanguages.code
            }
        };
    };

    this.getModifyPlacePageMessage = function (data) {
        return {
            bookPage: {
                pageId: data.pageId,
                description: data.description,
                author: data.author,
                publishDate: DateConverter.convertDisplayToInteger(data.publishDate),
                topic: Topics.getCodes(data.selectedTopics),
                language: data.selectedLanguages.code
            }
        };
    };
}];
