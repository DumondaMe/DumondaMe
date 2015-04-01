'use strict';

var app = require('angular').module('elyoosApp');

require('./file');

app.service('moment', require('./moment'));
app.service('CountryCodeConverter', require('./countryCodeConverter'));