'use strict';

module.exports = ['Topics', 'Languages', 'PlacesMessageService', function (Topics, Languages, PlacesMessageService) {

    this.getCreatePlacePageMessage = function (data) {
        return {
            placePage: {
                title: data.title,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages),
                website: data.website,
                keywords: data.selectedKeywords,
                places: PlacesMessageService.getMessage(data.selectedPlaces)
            }
        };
    };

    this.getModifyPlacePageMessage = function (data) {
        return {
            placePage: {}
        };
    };
}];
