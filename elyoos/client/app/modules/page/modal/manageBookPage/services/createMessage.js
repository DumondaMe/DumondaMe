'use strict';

module.exports = ['DateConverter', 'Topics', 'Languages', function (DateConverter, Topics, Languages) {

    this.getCreateBookPageMessage = function (data) {
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

    this.getModifyBookPageMessage = function (data) {
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
