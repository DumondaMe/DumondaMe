'use strict';

module.exports = ['Topics', 'Languages', function (Topics, Languages) {

    this.getCreateGenericPageMessage = function (data) {
        return {
            genericPage: {
                title: data.title,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages),
                website: data.website
            }
        };
    };

    this.getModifyGenericPageMessage = function (data) {
        return {
            genericPage: {}
        };
    };
}];
