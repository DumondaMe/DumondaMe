'use strict';

var app = angular.module('elyoosApp');

app.service('Mailcheck', require('./mailcheck'));
app.service('Bowser', require('./bowser'));
app.service('moment', require('./moment'));
app.service('Observables', require('./observables'));
app.service('SearchService', require('./searchService'));
app.service('UrlCache', require('./urlCache'));