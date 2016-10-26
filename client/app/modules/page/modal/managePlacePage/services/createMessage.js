'use strict';

module.exports = [function () {

    this.getCreatePlacePageMessage = function (data) {
        return {
            placePage: {
                title: data.title,
                places: [{description: data.selectedPlace.formatted, lat: data.selectedPlace.lat, lng: data.selectedPlace.lng}]
            }
        };
    };

    this.getModifyPlacePageMessage = function (data) {
        return {
            placePage: {}
        };
    };
}];
