'use strict';

var app = angular.module('elyoosApp');

app.service('Languages', require('./languages'));
app.service('RecommendationTypes', require('./recommendationTypes'));
app.service('Topics', require('./topics'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));