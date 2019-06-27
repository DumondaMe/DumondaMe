'use strict';

module.exports = ['Topics', 'Languages', function (Topics, Languages) {

    this.getCreateGenericPageMessage = function (data) {
        var result = {
            genericPage: {
                title: data.title,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages)
            }
        };

        if(angular.isString(data.website) && data.website.trim() !== "") {
            result.genericPage.website = data.website;
        }
        return result;
    };

    this.getEditGenericPageMessage = function (data) {
        var result = {
            genericPage: {
                pageId: data.pageId,
                title: data.title,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages)
            }
        };

        if(angular.isString(data.website) && data.website.trim() !== "") {
            result.genericPage.website = data.website;
        }
        return result;
    };
}];
