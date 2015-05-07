'use strict';

var app = require('angular').module('elyoosApp');

app.service('Languages', require('./languages'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));