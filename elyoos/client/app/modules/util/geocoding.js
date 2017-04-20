'use strict';

module.exports = ['$http', 'GeoCodingParser', function ($http, GeoCodingParser) {


    this.autoComplete = function (text) {
        if (text && text.trim().length > 0) {
            return $http.get('https://search.mapzen.com/v1/autocomplete', {
                params: {'text': text, 'api_key': 'mapzen-g4Ped1d', size: 7},
                headers: {elyoosversion: undefined},
                cache: true
            }).then(function (resp) {
                return GeoCodingParser.parseAutoComplete(resp, text);
            });
        }
    };
}];
