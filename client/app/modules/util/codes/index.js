'use strict';

var app = angular.module('elyoosApp');

app.service('Languages', require('./languages'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));