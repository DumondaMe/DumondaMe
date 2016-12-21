'use strict';

var app = angular.module('elyoosApp');

app.service('BrowserCode', require('./browser'));
app.service('OSCode', require('./operatingSystem'));
app.service('ScreenCode', require('./screen'));
app.service('Languages', require('./languages'));
app.service('RecommendationTypes', require('./recommendationTypes'));
app.service('Topics', require('./topics'));
app.service('PlaceCategories', require('./placeCategories'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));