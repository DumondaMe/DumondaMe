'use strict';

module.exports = ['Topics', 'Languages', 'PlacesMessageService', function (Topics, Languages, PlacesMessageService) {

    this.getCreateGenericPageMessage = function (data) {
        return {
            genericPage: {
                title: data.title,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages),
                website: data.website,
                places: PlacesMessageService.getMessage(data.selectedPlaces)
            }
        };
    };

    this.getModifyGenericPageMessage = function (data) {
        return {
            genericPage: {}
        };
    };
}];
